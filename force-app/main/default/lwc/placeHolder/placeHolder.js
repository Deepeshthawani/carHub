import { api, LightningElement } from 'lwc';
/*static resource*/
import CAR_HUB_PLACEHOLDER from '@salesforce/resourceUrl/placeholder'

export default class PlaceHolder extends LightningElement {
    @api message

    placeholderUrl = CAR_HUB_PLACEHOLDER

}