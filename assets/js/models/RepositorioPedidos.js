class RepositorioPedidos {
    constructor() {
        this.storageKey = 'xfood_orders_db';
        this.init();
    }

    init() {
        if (!localStorage.getItem(this.storageKey)) {
            localStorage.setItem(this.storageKey, JSON.stringify([]));
        }
    }

    save(pedido) {
        const orders = this.getAll();
        orders.push(pedido);
        localStorage.setItem(this.storageKey, JSON.stringify(orders));
    }

    getAll() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }

    getByStatus(status) {
        const orders = this.getAll();
        if (Array.isArray(status)) {
            return orders.filter(o => status.includes(o.status));
        }
        return orders.filter(o => o.status === status);
    }
    
    getByTable(tableNumber) {
        const orders = this.getAll();
        return orders.filter(o => o.table == tableNumber && o.status !== 'completed');
    }

    updateStatus(orderId, newStatus) {
        const orders = this.getAll();
        const orderIndex = orders.findIndex(o => o.id == orderId); 
        
        if (orderIndex !== -1) {
            orders[orderIndex].status = newStatus;
            localStorage.setItem(this.storageKey, JSON.stringify(orders));
            return true;
        }
        return false;
    }
}