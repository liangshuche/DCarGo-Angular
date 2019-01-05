import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { UserRegisterComponent } from './user-register/user-register.component';
import { CarRegisterComponent } from './car-register/car-register.component';

const routes: Routes = [
  { path: '', component: HomepageComponent},
  { path: 'user', component: UserRegisterComponent},
  { path: 'car', component: CarRegisterComponent}
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
