import { LightningElement, wire } from 'lwc';
//lightning message service
import CAR_SELECTED_MESSAGE from '@salesforce/messageChannel/CarSelected__c';
import {MessageContext, subscribe,unsubscribe} from 'lightning/messageService';

//Navigation
import { NavigationMixin } from 'lightning/navigation';

//Car__c Schema
import NAME_FIELD from '@salesforce/schema/Car__c.Name'
import PICTURE_URL_FIELD from '@salesforce/schema/Car__c.Picture_URL__c'
import CATEGORY_FIELD from '@salesforce/schema/Car__c.Category__c'
import MAKE_FIELD from '@salesforce/schema/Car__c.Make__c'
import MSRP_FIELD from '@salesforce/schema/Car__c.MSRP__C'
import FUEL_FIELD from '@salesforce/schema/Car__c.Fuel_Type__c'
import SEATS_FIELD from '@salesforce/schema/Car__c.Number_of_Seats__c'
import CONTROL_FIELD from '@salesforce/schema/Car__c.Control__c'
import CAR_OBJECT from '@salesforce/schema/Car__c'
import { getFieldValue } from 'lightning/uiRecordApi';


export default class CarCard extends NavigationMixin(LightningElement) {

    /// load content for LMS
    @wire(MessageContext)
    messageContext
    //exposing fields to make them available in template
    categoryField = CATEGORY_FIELD
    makeField = MAKE_FIELD
    msrpField = MSRP_FIELD
    fuelField = FUEL_FIELD
    seatsField = SEATS_FIELD
    controlField = CONTROL_FIELD

    recordId
    objectApiName = CAR_OBJECT

    carName
    carPictureURL

    //subscription reference for carSelected
    carSelectionSubscription

    handleRecordLoaded(event){
        const {records} = event.detail
        const recordData = records[this.recordId]
        this.carName = getFieldValue(recordData,NAME_FIELD)
        this.carPictureURL = getFieldValue(recordData,PICTURE_URL_FIELD)

    }

    connectedCallback(){
        this.subscribeHandler()
    }

    subscribeHandler(){
        this.carSelectionSubscription = subscribe(this.messageContext,CAR_SELECTED_MESSAGE, (message)=>this.handleCarSelected(message))
    }

    handleCarSelected(message){
        this.recordId = message.carId

    }

    disconnectedCallback(){
        unsubscribe(this.carSelectionSubscription)
        this.carSelectionSubscription = null
    }

    /**Navigate to record page */
    handleNavigateToRecord(){
        this[NavigationMixin.Navigate]({
            type: "standard__recordPage",
            attributes: {
                recordId: this.recordId,
                objectApiName:CAR_OBJECT.objectApiName,
                actionName:'view'
            }
        });
    }
}