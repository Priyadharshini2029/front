class AuthService {
    static roles = {
        ADMIN: "Admin",
        CHEF: "Chef",
        WAITER: "Waiter",
    };

    static getRole() {
        return localStorage.getItem("Myhotelrole");
    }

    static isAdmin() {
        return this.getRole() === this.roles.ADMIN;
    }

    static isChef() {
        return this.getRole() === this.roles.CHEF;
    }

    static isWaiter() {
        return this.getRole() === this.roles.WAITER;
    }

    static isCustomer() {
        const role = this.getRole();
        return Object.values(this.roles).includes(role);
    }
}

export default AuthService;
