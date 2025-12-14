const repository = new RepositorioPedidos();
const meseroView = new MeseroView();
const cocinaView = new CocinaView();
const adminView = new AdminView();

window.app = {
    pedidoController: new PedidoController(repository, meseroView, cocinaView, adminView),
    currentUser: { role: '', name: '' }
};

document.addEventListener('DOMContentLoaded', () => {
    
    app.pedidoController.init();

    const loginView = document.getElementById('login-view');
    const nameInputSection = document.getElementById('name-input-section');
    const nameInput = document.getElementById('username-input');
    const roleBtns = document.querySelectorAll('.role-btn');
    
    roleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            roleBtns.forEach(b => b.classList.remove('active', 'border-dark'));
            btn.classList.add('active', 'border-dark');
            
            app.currentUser.role = btn.dataset.role;
            
            nameInputSection.classList.remove('d-none');
            nameInput.focus();
        });
    });

    document.getElementById('btn-login-confirm').addEventListener('click', () => {
        const name = nameInput.value.trim();
        if(!name) return alert("Please enter your name");

        app.currentUser.name = name;
        
        document.getElementById('user-info').classList.remove('d-none');
        document.getElementById('btn-logout').classList.remove('d-none');
        document.getElementById('role-display').textContent = app.currentUser.role.charAt(0).toUpperCase() + app.currentUser.role.slice(1);
        document.getElementById('name-display').textContent = name;

        loginView.classList.add('d-none');

        navigateToRoleView(app.currentUser.role);
    });

    document.getElementById('btn-logout').addEventListener('click', () => {
        location.reload();
    });

    document.getElementById('btn-back-login').addEventListener('click', () => {
        nameInputSection.classList.add('d-none');
        roleBtns.forEach(b => b.classList.remove('active', 'border-dark'));
    });

    document.getElementById('btn-back-tables').addEventListener('click', () => {
        app.pedidoController.volverAMesas();
    });

    const btnAddItem = document.getElementById('btn-add-item');
    if (btnAddItem) {
        btnAddItem.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            app.pedidoController.agregarItemModal();
        });
        
        btnAddItem.disabled = false;
    }

    document.getElementById('form-new-order').addEventListener('submit', (e) => {
        e.preventDefault();
        app.pedidoController.enviarPedido();
    });
    
    const modalNewOrder = document.getElementById('modalNewOrder');
    modalNewOrder.addEventListener('show.bs.modal', () => {
        app.pedidoController.iniciarNuevaOrden();
        
        const btnAddItem = document.getElementById('btn-add-item');
        if (btnAddItem) {
            btnAddItem.disabled = false;
            btnAddItem.style.pointerEvents = 'auto';
        }
    });
});

function navigateToRoleView(role) {
    document.getElementById('waiter-tables-view').classList.add('d-none');
    document.getElementById('waiter-order-view').classList.add('d-none');
    document.getElementById('kitchen-view').classList.add('d-none');
    document.getElementById('admin-view').classList.add('d-none');

    if (role === 'waiter') {
        document.getElementById('waiter-tables-view').classList.remove('d-none');
        app.pedidoController.refreshAllViews();
    } else if (role === 'kitchen') {
        document.getElementById('kitchen-view').classList.remove('d-none');
        app.pedidoController.refreshAllViews();
    } else if (role === 'admin') {
        document.getElementById('admin-view').classList.remove('d-none');
        app.pedidoController.refreshAllViews();
    }
}