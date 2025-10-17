import { HttpClient } from "@angular/common/http";
import { inject } from "@angular/core";
import { BASE_API_URL } from "..";

export abstract class BaseHttpApi {
    private http = inject(HttpClient);
    private readonly API_URL = inject(BASE_API_URL);

    // Se implementa solo el GET por una cuestion de que los demas verbos HTTP no son necesarios en este proyecto
    protected get<T>(url: string, params?: any) {
        return this.http.get<T>(`${this.API_URL}${url}`, { params });
    }
}