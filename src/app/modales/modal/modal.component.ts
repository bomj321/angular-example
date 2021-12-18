import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'app-modal',
	template: `
		<div [class]="'modal-header '+headerClass" [ngClass]="{'text-white': headerClass}">
			<h4 class="modal-title w-100 font-weight-bold" [ngClass]="{'text-white': headerClass}" id="modal-basic-title" [innerHtml]="title" (click)="copyCodeModal()"></h4>
			<button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
				<span aria-hidden="true" [ngClass]="{'text-white': headerClass}" style="
				margin: -1rem 0rem -1rem 1rem;
			">&times;</span>
			</button>
		</div>
		<div class="modal-body" ngbAutofocus>
			<ng-content></ng-content>
		</div>
	`,
	styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
	@Input() title: string = '';
	@Input() preservationCode: any;
	@Input() headerClass: string = '';
	@Input() textToCopy: string = '';

	constructor(public activeModal: NgbActiveModal, private toastr: ToastrService) { }

	ngOnInit() {

	}



	copyCodeModal() {

		if (this.preservationCode) {
			var txtArea = document.createElement("textarea");
			txtArea.id = 'txt';
			txtArea.style.position = 'fixed';
			txtArea.style.top = '0';
			txtArea.style.left = '0';
			txtArea.style.opacity = '0';
			txtArea.value = this.preservationCode.split("-").pop();
			document.body.appendChild(txtArea);
			txtArea.select();
			/* Select the text field */

			/* Copy the text inside the text field */
			document.execCommand("copy");
			this.toastr.success('Código copiado con éxito');
		}


	}

}
