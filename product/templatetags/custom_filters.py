from django import template

register = template.Library()

@register.filter
def get_item_quantity(item_quantities, product_id):
    return item_quantities.get(product_id, 0)