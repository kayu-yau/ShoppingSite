import json
from pyexpat.errors import messages
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.views.decorators.http import require_http_methods
from .models import Cart, CartItem, Product

def home(request):
    products = Product.objects.all()

    # Initialize variables for cart and quantities
    cart = None
    item_quantities = {}

    if request.user.is_authenticated:
        cart, created = Cart.objects.get_or_create(user=request.user, completed=False)
        item_quantities = {item.product.id: item.quantity for item in cart.cartitems.all()}

    return render(request, 'home.html', {
        'products': products,
        'item_quantities': item_quantities,  # Pass item_quantities to the template
    })

def cart(request):
    cart = None
    cartitems = []
    
    if request.user.is_authenticated:
        cart, created = Cart.objects.get_or_create(user=request.user, completed=False)
        cartitems = cart.cartitems.all()  # Refresh the cart items from the database
    
    context = {"cart": cart, "items": cartitems}
    return render(request, "cart.html", context)

def add_to_cart(request):
    data = json.loads(request.body)
    product_id = data["id"]
    quantity_to_add = data.get("quantity", 1)  # Get the quantity, default to 1 if not provided
    product = get_object_or_404(Product, id=product_id)
    
    if request.user.is_authenticated:
        cart, created = Cart.objects.get_or_create(user=request.user, completed=False)
        cartitem, created = CartItem.objects.get_or_create(cart=cart, product=product)
        cartitem.quantity += quantity_to_add  # Update the quantity based on incoming data
        cartitem.save()

        num_of_item = cart.num_of_items
        
        print(cartitem)
    return JsonResponse({'num_of_items': cart.num_of_items})

def update_cart(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            item_id = data.get('id')
            new_quantity = data.get('quantity')

            # Ensure the cart item exists
            cart_item = get_object_or_404(CartItem, id=item_id)

            # Update the cart item quantity
            cart_item.quantity = new_quantity
            cart_item.save()

            # Recalculate the total price
            cart = get_object_or_404(Cart, user=request.user, completed=False)
            new_total_price = cart.total_price

            return JsonResponse({'new_total_price': new_total_price})

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Invalid request'}, status=400)
  
@require_http_methods(["DELETE"])
def delete_cart_item(request, item_id):
    try:
        cart_item = get_object_or_404(CartItem, id=item_id)
        cart_item.delete()

        cart = get_object_or_404(Cart, user=request.user, completed=False)
        
        return JsonResponse({
            'success': True,
            'new_total_price': cart.total_price,
            'num_of_items': cart.num_of_items
        })
    except CartItem.DoesNotExist:
        return JsonResponse({'error': 'Item not found'}, status=404)
      
def confirm_payment(request, pk):
    cart = Cart.objects.get(id=pk)
    cart.completed = True
    cart.save()
    messages.success(request, "Payment made successfully")
    return redirect("index")