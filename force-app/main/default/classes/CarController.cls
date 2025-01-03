public with sharing class CarController {
    //wrapper class
    public class Filters{
        @AuraEnabled
        public String searchkey {get; set;}
        @AuraEnabled
        public Decimal maxPrice {get; set;}
        @AuraEnabled
        public String[] categories {get; set;}
        @AuraEnabled
        public String[] makeType {get; set;}

    } 


    @AuraEnabled(Cacheable=true)
    public static List<Car__c> getCars(Filters filters){
        String key;
        String whereClause='';
        Decimal maxPrice;
        String[] categories;
        String[] makeType;
        String[] criteria = new List<String>{};
        if(filters != null){
            maxPrice = filters.maxPrice;
            categories = filters.categories;
            makeType=filters.makeType;
            if(!String.isEmpty(filters.searchkey)){
                key = '%' + filters.searchkey + '%';
                criteria.add('Name LIKE: key');
            }

            if(filters.maxPrice >= 0){
                criteria.add('MSRP__c <= :maxPrice');
            }
            if(filters.categories!=null){
                criteria.add('Category__c IN :categories');
            }
            if(filters.makeType!=null){
                criteria.add('Make__c IN :makeType');
            }
            if(criteria.size()>0){
                whereClause= ' WHERE ' + String.join(criteria, ' AND ');
            }
        }
        String query = 'Select Id, Name, MSRP__c, Description__c, Category__c, Picture_URL__c From Car__c' + whereClause + ' WITH SECURITY_ENFORCED' + ' ORDER BY Name';
        System.debug(query);
        return Database.query(query);
    }

    @AuraEnabled(cacheable=true)
    public static Car__c[] getSimilarCars(Id carId, String[] makeType){
        return [Select Id,Name,MSRP__c,Description__c,Category__c,Picture_URL__c,Make__c from Car__c where Make__c in :makeType AND Id != :carId];
    }



}