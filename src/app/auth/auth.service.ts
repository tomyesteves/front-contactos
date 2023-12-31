import { Injectable } from '@angular/core';
import { TokenResponse, User, UserAndToken } from './interfaces/user.interface';
import { Observable, catchError, map, of, switchMap, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly USER_KEY = "user";

  private baseUrl = "http://localhost:3000";
  private userAndToken?: UserAndToken = undefined;

  private emails = [
    "abc@abc.com",
    "bca@bca.com"
  ]

  constructor(
    private http: HttpClient
  ) { }

  public isEmailValid(value: string): Observable<boolean> {
    return of(this.emails.includes(value));
  }

  get currentUser(): User | undefined {
    // if (!this.user) return undefined;
    return structuredClone(this.userAndToken?.user);
  }

  private saveUserToLocalStorage(user: UserAndToken) {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.userAndToken = user;
  }

  checkAuthentication(): Observable<boolean> {
    if (!localStorage.getItem(this.USER_KEY)) {
      this.userAndToken = undefined
      return of(false)
    }

    this.userAndToken = JSON.parse(localStorage.getItem(this.USER_KEY)!);

    return this.http.get<User>(`${this.baseUrl}/auth/user`, {
      headers: {
        'Authorization': `Bearer ${this.userAndToken?.token}`
      }
    }).pipe(
      tap(user => this.userAndToken!.user = user),
      map((user) => !!user)
    );
  }

  doLogin(email: string, password: string): Observable<User> {
    //TODO: Cambiar por post al backend.
    return this.http.post<TokenResponse>(`${this.baseUrl}/auth/login`, { email, password })
      .pipe(
        tap(tokenResponse => console.log("token", tokenResponse.token)),
        switchMap((tokenResponse: any) => {
          const token = tokenResponse.token;
          return this.http.get<User>(`${this.baseUrl}/auth/user`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }).pipe(
            tap(user => this.saveUserToLocalStorage({ user, token }))
          );
        }),
        catchError((error: any) => {
          console.error(error.message);
          return throwError(() => error.message);
        })
      );
  }

  doLogout() {
    localStorage.clear();
    this.userAndToken = undefined;
  }
}
