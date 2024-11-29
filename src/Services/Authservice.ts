// class RoleServices {
//     static getRole() {
//         const role= localStorage.getItem("Myhotelrole") ?? "";
//         if (role) return role 
//         // return localStorage.getItem("Myhotelrole") ?? "";
//     }

//     static isAdmin() {
//         return this.getRole() === "Admin";
//     }

//     static isChef() {
//         return this.getRole() === "Chef";
//     }

//     static isWaiter() {
//         return this.getRole() === "Waiter";
//     }

//     static isEmployee() {
//         const role = this.getRole();
//         return ["Admin", "Chef", "Waiter"].includes(role);
//     }

//     static isCustomer() {
//         const role = this.getRole();
//         return role === "Customer" || role === "";
//     }
// }

// export default RoleServices;
