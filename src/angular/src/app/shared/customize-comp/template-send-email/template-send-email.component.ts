import { Component, Injector, Input, OnInit } from '@angular/core';
import { ModalComponentBase } from '@app/shared/common/modal-component-base';

@Component({
    selector: 'template-send-email',
    templateUrl: './template-send-email.component.html',
    styleUrls: ['./template-send-email.component.scss'],
})
export class TemplateSendEmailComponent extends ModalComponentBase implements OnInit {
    @Input() content: string = 'Nhập content';

    toolbarSettings: object = {
        type: 'MultiRow',
        items: [
            'Bold',
            'Italic',
            'Underline',
            'StrikeThrough',
            'FontName',
            'FontSize',
            'FontColor',
            'BackgroundColor',
            'LowerCase',
            'UpperCase',
            '|',
            'Formats',
            'Alignments',
            'OrderedList',
            'UnorderedList',
            'Outdent',
            'Indent',
            '|',
            'CreateLink',
            'Image',
            '|',
            'FullScreen',
        ],
    };

    insertImageSettings: Object = {
        saveFormat: 'Base64',
    };

    constructor(injector: Injector) {
        super(injector);
    }

    ngOnInit(): void { }

    save() {
        this.success(this.content);
    }
}
