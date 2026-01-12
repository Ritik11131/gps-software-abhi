import { Injectable } from "@angular/core";

import { StorageService } from "./storage.service";
import { Router } from "@angular/router";
import { UserService } from "../shared/user/services/user.service";
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";
import { ConfirmationDialogComponent } from "../shared/components/confirmation-dialog/confirmation-dialog.component";

@Injectable({ providedIn: "root" })
export class SessionService {
    constructor(private indexedDB: StorageService,
        private router: Router, private userService: UserService, private modalService: BsModalService) { }

    logout() {
        localStorage.clear();
        sessionStorage.clear();
        this.indexedDB.clear();
        window.location.href = 'login';
        // this.router.navigateByUrl('/login')
        this.modalService.hide('confirmationModal');
      
        this.modalService.hide('confirmationModal');
        const payload = {
            "FCMToken": localStorage.getItem("token"),
            "status" : 0
        }
        // this.userService.logout(payload).subscribe(res => {
        //     if (res.body.ResponseMessage === "Success") {
        //         this.openConfirmationModal({
        //             title: res.body.Result.Message || "",
        //             content: res.body.Result.Data || 'Something went wrong',
        //             primaryActionLabel: 'Ok',
        //             secondaryActionLabel: false,
        //             onPrimaryAction: () => {
        //                 this.hideConfirmationModal();
        //             },
        //         });               

        //     }

        // })
    }
    hideConfirmationModal() {
        localStorage.clear();
        sessionStorage.clear();
        this.indexedDB.clear();
        window.location.href = 'login'
        this.modalService.hide('confirmationModal');

    }
    modalRef!: BsModalRef;
    openConfirmationModal(data = {}) {
        const initialState: ModalOptions = {
            backdrop: true,
            ignoreBackdropClick: true,
            initialState: {
                ...data,
            },
        };
        this.modalRef = this.modalService.show(
            ConfirmationDialogComponent,
            Object.assign(initialState, {
                id: 'confirmationModal',
                class: 'modal-md modal-dialog-centered',
            })
        );
    }

    redirectToLogin(currentURL: string) {
        this.storeCurrentLocation(currentURL);
        sessionStorage.removeItem('inactiveSession');
        // window.location.href = 'login';
        this.router.navigateByUrl('login')
    }

    storeCurrentLocation(currentURL: string) {
        sessionStorage.setItem("redirectURL", currentURL);
    }
    adminlogout(){
        localStorage.clear();
        sessionStorage.clear();
        this.indexedDB.clear();
        window.location.href = 'login'
    }
}