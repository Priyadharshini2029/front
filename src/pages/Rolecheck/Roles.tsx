class Roles{
    static isAdmin(){
        const role = localStorage.getItem("Myhotelrole")
        return role === "Admin";
    }

    static isChef(){
        const role = localStorage.getItem("Myhotelrole")
        return role === "Chef";
    }

    static isWaiter(){
        const role = localStorage.getItem("Myhotelrole")
        return role === "Waiter";
    }

    static isCustomer(){
        const role = localStorage.getItem("Myhotelrole")
        return role === "Admin" ||role === "Chef" || role === "Waiter";
    }
}

export default Roles;