from django.contrib import admin
from product.models import Cart, CartItem, Product

class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'quantity')

admin.site.register(Product, ProductAdmin)
admin.site.register(Cart)
admin.site.register(CartItem)