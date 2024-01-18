const list = document.querySelector("#list");
const input = document.querySelector("#input");
const addBtn = document.querySelector("#addBtn");

class ToDoService{
    static editingMode = false;
    static items = [];
    static selectedItem = 0;
    static addListitem(){
        if(input.value == ''){
            alert('Please fill out the field');
            return;
        }
        const listItem = new ListItem(input.value);
        input.value = '';
        this.items.push(listItem);
        this.saveToLocalStorage();
    }

    static editMode(id){
        this.editingMode = true;
        addBtn.innerHTML = 'Edit';
        this.selectedItem = this.items.find((item) => item.itemId === id);
        input.value = this.selectedItem.text;
    }

    static editListItem(){
        if(input.value == ''){
            alert('Please fill out the field');
            return;
        }
        this.selectedItem.changeText(input.value);
        input.value = '';
        addBtn.innerHTML = 'Add';
        this.editingMode = false;
        this.saveToLocalStorage();
    }

    static removeListItem(id){
        this.selectedItem = this.items.find((item) => item.itemId === id);
        this.items.splice(id, 1);
        this.selectedItem.removeItem();
        this.saveToLocalStorage();
    }

    static saveToLocalStorage(){
        const json = JSON.stringify(this.items);
        localStorage.setItem('items', json);
    }

    static loadFromLocalStorage(){
        const getItems = localStorage.getItem('items');
        const loadedItems = JSON.parse(getItems);
        loadedItems.forEach(listItem => {
            this.items.push(new ListItem(listItem.text));
        });
    }
}

class ListItem{
    static id = 0;
    constructor(text){
        this.text = text;
        this.isFinished = false;
        this.itemId = ListItem.id;
        ListItem.id ++;
        this.renderItem();
    }

    renderItem(){
        if(!this.el){
            this.el = document.createElement("li");
            this.span = document.createElement("span");
            this.el.appendChild(this.span);
            this.span.addEventListener('click', () => this.markAsFinished());
            list.appendChild(this.el);
        }
        this.span.innerText = this.text;
        if(!this.editBtn){
            this.addEditBtn();
        }
        if(!this.removeBtn){
            this.addRemoveBtn();
        }

        if(this.isFinished){
            this.span.setAttribute('id', 'finishedItem');
        }else{
            this.span.removeAttribute('id');
        }

    }

    addEditBtn(){
        this.editBtn = document.createElement('button');
        this.editBtn.innerHTML = "Edit";
        this.editBtn.setAttribute('id', 'editBtn');
        this.editBtn.addEventListener('click', () => ToDoService.editMode(this.itemId));
        this.el.appendChild(this.editBtn);
    }

    addRemoveBtn(){
        this.removeBtn = document.createElement('button');
        this.removeBtn.innerHTML = 'Remove';
        this.removeBtn.setAttribute('id', 'removeBtn');
        this.removeBtn.addEventListener('click', () => ToDoService.removeListItem(this.itemId));
        this.el.appendChild(this.removeBtn);
    }

    changeText(text){
        this.text = text;
        this.renderItem();
    }

    removeItem(){
        this.el.remove();
    }

    markAsFinished(){
        this.isFinished = !this.isFinished;
        this.renderItem();
    }
}

addBtn.addEventListener('click', () =>{
    if(ToDoService.editingMode === false){
        ToDoService.addListitem();
    }else{
        ToDoService.editListItem();
    }
});

ToDoService.loadFromLocalStorage();

