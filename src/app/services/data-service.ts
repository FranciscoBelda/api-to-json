import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';

@Service()
export class DataService {


  private readonly http: HttpClient = inject(HttpClient);

  constructor() {}

  /**
   * Carga los datos paginados de una API y concatena los elementos.
   * @param url URL base de la API (incluyendo la query param de página al final, ej: "https://api.../movies?page=")
   * @param lastPage Número total de páginas a consultar
   * @param dataPath (Opcional) Ruta de la propiedad que contiene el Array (ej: "results" o "data.items")
   */
  loadData(url: string, lastPage: number, dataPath?: string): Observable<any[]> {
    const movies: any[] = [];
    let page = 1;

    const getMoviesByPage = (currentPage: number): Observable<any> => {
      return this.http.get<any>(`${url}${currentPage}`);
    };

    return new Observable<any[]>((observer) => {
      const fetchData = () => {
        getMoviesByPage(page).subscribe({
          next: (response) => {
            // Extraemos los elementos según el path o tomamos la respuesta directa
            const items = this.getValueByPath(response, dataPath);

            // Verificamos que sea un array antes de hacer spread
            if (Array.isArray(items)) {
              movies.push(...items);
            } else if (items !== undefined && items !== null) {
              movies.push(items);
            }

            page++;
            if (page <= lastPage) {
              fetchData();
            } else {
              observer.next(movies);
              observer.complete();
            }
          },
          error: (error) => {
            console.error('Error al obtener la página:', page, error);
            observer.error(error);
          },
        });
      };

      fetchData();
    });
  }

  /**
   * Navega en un objeto para extraer la propiedad dada una clave con notación de puntos.
   * Ejemplos: "results" -> obj.results | "data.items" -> obj.data.items
   */
  private getValueByPath(obj: any, path?: string): any {
    if (!path || !path.trim()) return obj;
    return path
      .split('.')
      .reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : null), obj);
  }
}

