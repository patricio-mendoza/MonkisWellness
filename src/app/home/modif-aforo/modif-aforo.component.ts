//Autor Omar Cota 
//Componente (Pantalla modal) que permite cambiar el aforo máximo del gimnasio.
// 16/05/2023
import { Component } from '@angular/core';
import { HomeComponent } from '../home.component';
import { HttpHeaders } from '@angular/common/http';

const API_URI = 'http://localhost:8888/api';


@Component({
  selector: 'app-modif-aforo',
  templateUrl: './modif-aforo.component.html',
  styleUrls: ['./modif-aforo.component.scss']
})

export class ModifAforoComponent extends HomeComponent{

  //Dentro del método saveNewAforo(), se realiza la siguiente secuencia de acciones: Verifica si la longitud de this.newAforo es igual a cero. Si es así, se sale del método y no se realiza ninguna acción adicional.
  saveNewAforo() {
    if (this.newAforo.length === 0) { return }
    
    let token = localStorage.getItem('token');
    const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json');
    const options = { headers: headers };

    //Se realiza una solicitud PUT al URI http://localhost:8888/api/gym/updateAforo/${this.newAforo} utilizando HttpClient. La matriz vacía [] se pasa como cuerpo de la solicitud, y se proporciona el objeto options que contiene los encabezados.
    this.http.put(`${API_URI}/gym/updateAforo/${this.newAforo}`,[], options).subscribe();
    /*Se modifican propiedades en miServicio, el cual es un servicio compartido en la aplicación, estableciendo isModifyingAforo en false y llamando al método cambiarEstado(true).*/ 
    this.miServicio.isModifyingAforo = false;
    this.miServicio.cambiarEstado(true);
  }
}
