class PedidoController {
    constructor(repository, meseroView, cocinaView, adminView) {
        this.repo = repository;
        this.meseroView = meseroView;
        this.cocinaView = cocinaView;
        this.adminView = adminView;

        this.currentTable = null;
        this.currentOrder = null; 
        
        this.menuItems = [
            new ItemMenu(1, 'Margherita Pizza', 'Main', 12.00),
            new ItemMenu(2, 'Pepperoni Pizza', 'Main', 14.50),
            new ItemMenu(3, 'Grilled Chicken', 'Main', 15.00),
            new ItemMenu(4, 'Beef Burger', 'Main', 13.00),
            new ItemMenu(5, 'Caesar Salad', 'Starter', 9.00),
            new ItemMenu(6, 'Tomato Soup', 'Starter', 7.50),
            new ItemMenu(7, 'Tiramisu', 'Dessert', 6.00),
            new ItemMenu(8, 'Coca Cola', 'Drink', 2.50),
            new ItemMenu(9, 'Orange Juice', 'Drink', 3.00),
            new ItemMenu(10, 'Bandeja paisa', 'Main', 20.00),
            new ItemMenu(11, 'Agua', 'Drink', 1.00),
            new ItemMenu(12, 'Coca Cola', 'Drink', 2.50),
            new ItemMenu(13, 'Sprite', 'Drink', 2.50),
            new ItemMenu(14, 'Fanta', 'Drink', 2.50),
            new ItemMenu(15, '7 Up', 'Drink', 2.50),
            new ItemMenu(16, 'Ice Tea', 'Drink', 2.50),
            new ItemMenu(17, 'Ice Coffee', 'Drink', 2.50),
        ];
    }

    init() {
        this.meseroView.fillMenuOptions(this.menuItems);
        this.refreshAllViews();
    }

    seleccionarMesa(tableNumber) {
        this.currentTable = tableNumber;
        console.log(`Mesa ${tableNumber} seleccionada`);
        
        document.getElementById('waiter-tables-view').classList.add('d-none');
        document.getElementById('waiter-order-view').classList.remove('d-none');
        document.getElementById('current-table-number').textContent = tableNumber;

        const orders = this.repo.getByTable(tableNumber);
        this.meseroView.renderTableOrders(orders);
    }

    iniciarNuevaOrden() {
        if (!this.currentTable) {
            alert("Por favor selecciona una mesa primero.");
            const modalEl = document.getElementById('modalNewOrder');
            const modal = bootstrap.Modal.getInstance(modalEl);
            if (modal) modal.hide();
            return;
        }

        const waiterName = document.getElementById('name-display').textContent || 'Staff';
        this.currentOrder = new Pedido(this.currentTable, waiterName);
        console.log("Nueva orden inicializada para mesa: " + this.currentTable);
        this.meseroView.renderModalItems([], 0);
        
        document.getElementById('menu-select').value = 'Select an item...';
        
        const addButton = document.getElementById('btn-add-item');
        if (addButton) {
            addButton.disabled = false;
            addButton.style.pointerEvents = 'auto';
        }
    }

    agregarItemModal() {
        // Validación de seguridad por si acaso
        if (!this.currentOrder) {
            console.warn("Orden no existía, creando una nueva...");
            this.iniciarNuevaOrden();
        }

        const select = document.getElementById('menu-select');
        const itemId = parseInt(select.value);
        
        if (isNaN(itemId)) {
            alert("Por favor selecciona un plato.");
            return;
        }

        const item = this.menuItems.find(i => i.id === itemId);
        
        if (item) {
            this.currentOrder.addItem(item, 1);
            this.meseroView.renderModalItems(this.currentOrder.items, this.currentOrder.total);
        }
    }

    eliminarItemModal(index) {
        if (!this.currentOrder) return;
        
        this.currentOrder.items.splice(index, 1);
        this.currentOrder.calculateTotal();
        this.meseroView.renderModalItems(this.currentOrder.items, this.currentOrder.total);
    }

    enviarPedido() {
        if (!this.currentOrder || this.currentOrder.items.length === 0) {
            return alert("La orden está vacía.");
        }

        this.repo.save(this.currentOrder);

        const modalEl = document.getElementById('modalNewOrder');
        const modal = bootstrap.Modal.getInstance(modalEl);
        modal.hide();

        this.refreshAllViews();
        
        const orders = this.repo.getByTable(this.currentTable);
        this.meseroView.renderTableOrders(orders);
    }

    marcarCompletado(orderId) {
        this.repo.updateStatus(orderId, 'completed');
        this.meseroView.showNotification("¡Orden finalizada!");
        this.refreshAllViews();
        const orders = this.repo.getByTable(this.currentTable);
        this.meseroView.renderTableOrders(orders);
    }

    volverAMesas() {
        document.getElementById('waiter-order-view').classList.add('d-none');
        document.getElementById('waiter-tables-view').classList.remove('d-none');
        this.refreshAllViews();
    }

    cambiarEstado(orderId, newStatus) {
        this.repo.updateStatus(orderId, newStatus);
        this.refreshAllViews();
    }

    refreshAllViews() {
        const allOrders = this.repo.getAll();
        
        if(this.cocinaView) this.cocinaView.renderKitchen(allOrders);
        if(this.adminView) this.adminView.renderDashboard(allOrders);
        
        if(this.meseroView) {
            if(!document.getElementById('waiter-tables-view').classList.contains('d-none')){
                this.meseroView.renderTables(); 
            }

            const activeOrders = allOrders.filter(o => o.status !== 'completed');
            this.meseroView.updateTableBadges(activeOrders);
        }
    }

    resetearBaseDeDatos() {
        if(confirm("¿ESTÁS SEGURO? Esto borrará todos los pedidos.")) {
            localStorage.clear();
            location.reload();
        }
    }
}