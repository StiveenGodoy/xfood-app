class Pedido {
    constructor(tableNumber, waiterName) {
        this.id = "ORD-" + Date.now();
        this.table = tableNumber;
        this.waiter = waiterName;
        this.items = [];
        this.status = 'pending';
        this.total = 0.00;
        this.createdAt = new Date().toLocaleString();
    }

    addItem(itemMenu, quantity = 1) {
        const existingItem = this.items.find(i => i.item.id === itemMenu.id);
        
        if (existingItem) {
            existingItem.quantity += parseInt(quantity);
        } else {
            this.items.push({ item: itemMenu, quantity: parseInt(quantity) });
        }
        this.calculateTotal();
    }

    calculateTotal() {
        this.total = this.items.reduce((sum, orderItem) => {
            return sum + (orderItem.item.price * orderItem.quantity);
        }, 0);
    }
}