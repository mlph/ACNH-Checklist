import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecipeComponent } from './components/table/recipe/recipe.component';
import { ItemComponent } from './components/table/item/item.component';
import { CreatureComponent } from './components/table/creature/creature.component';

const routes: Routes = [
  { path: "item", component: ItemComponent },
  { path: "recipe", component: RecipeComponent },
  { path: "creature", component: CreatureComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
