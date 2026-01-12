import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';


@Injectable({
  providedIn: 'root'
})
export class SkySearchService {
  searchResults(searchCurrentPage: number, searchResultFields: string, searchResultsPageSize: number, searchKey: string) {
    throw new Error("Method not implemented.");
  }

  constructor(private http$: HttpClient) { }


//   searchResults(searchPageNumber: any,searchResultFields:any,searchResultsPageSize:any,searchResultQuery:any): Observable<any> {
//     const url = API_CONSTANTS.productSearch;
//     let formatedURl:  string = url+"currentPage="+searchPageNumber+"&fields="+searchResultFields+"&pageSize="+searchResultsPageSize+"&query="+searchResultQuery;

//       return this.apiService.getSearchResults(formatedURl);     
//     }
//     searchSuggestions(suggestionsFields: any,suggestionMaxSize:any,suggestionTerm:any): Observable<any> {
//       const url = API_CONSTANTS.productSuggestions;
//       let formatedURl:  string = url+"&fields=FULL"+suggestionsFields+"&max="+suggestionMaxSize+"&term="+suggestionTerm;
//       return this.apiService.getSearchSugestions(formatedURl); 
//     }
}
