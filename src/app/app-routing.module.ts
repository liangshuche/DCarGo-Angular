import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { CarRegisterComponent } from './car-register/car-register.component';
import { UserComponent } from './user/user.component';
import { CarListComponent } from './car-list/car-list.component';
import { DriveComponent } from './drive/drive.component';
import { AuthGuardService } from './core/services/auth-guard.service';

const routes: Routes = [
  { path: '', component: HomepageComponent},
  // { path: 'user', component: UserRegisterComponent},
  { path: 'cars', component: CarListComponent, canActivate: [AuthGuardService]},
  { path: 'rent-out', component: CarRegisterComponent, canActivate: [AuthGuardService] },
  { path: 'user', component: UserComponent },
  { path: 'drive', component: DriveComponent, canActivate: [AuthGuardService] },
  // { path: 'crash', component: CrashComponent }
  // { path: '', redirectTo: '/recipes', pathMatch: 'full' },
  // { path: 'recipes', component: RecipesComponent, children: [
    // { path: '', component: RecipeStartComponent },
    // { path: 'new', component: RecipeEditComponent },
    // { path: ':id', component: RecipeDetailComponent },
    // { path: ':id/edit', component: RecipeEditComponent },
  // ] },
  // { path: 'shopping-list', component: ShoppingListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
