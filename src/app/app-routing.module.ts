import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecipeComponent } from './components/recipe/recipe.component';
import { ItemComponent } from './components/item/item.component';
import { CreatureComponent } from './components/creature/creature.component';

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
