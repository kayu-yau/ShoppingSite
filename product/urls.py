from django.urls import path
from product import views

urlpatterns = [
  path('', views.home, name="index"),
  path("cart", views.cart, name="cart"),
  path("update_cart/", views.update_cart, name="update_cart"),
  path("delete_cart_item/<int:item_id>/", views.delete_cart_item, name="delete_cart_item"),
  path("add_to_cart", views.add_to_cart, name= "add"),
  path("confirm_payment/<str:pk>", views.confirm_payment, name="add")
]