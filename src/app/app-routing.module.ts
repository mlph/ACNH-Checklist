import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecipeComponent } from './components/recipe/recipe.component';
import { TableComponent } from './components/table/table.component';

const routes: Routes = [
  { path: "item", component: TableComponent },
  { path: "recipe", component: RecipeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
