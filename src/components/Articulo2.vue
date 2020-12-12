<template>
    <v-layout align-start>
        <!--DIALOG ARTICULOS --> 
        <v-dialog v-model="prverdialog" persistent max-width="800px">
      <v-card>
        <v-card-title>
          <h5>Artículos </h5>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-sm class="pa-0 white">
            <v-layout row wrap style="background-color: rgba(255,255,255,1);">
              <v-flex xs12 sm12 md12>
                <v-text-field  v-model="prdialogdescrip" label="Artículo descripción"></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md12>
                <v-text-field  v-model="prdialogdescrip" label="Artículo modelo"></v-text-field>
              </v-flex> 
               <v-flex xs12 sm12 md12>
                <v-text-field  v-model="prdialogprecio" label="Artículo precio"></v-text-field>
              </v-flex>
               <v-flex xs12 sm12 md12>
                <v-text-field  v-model="prdialogprecio" label="Artículo existencia"></v-text-field>
              </v-flex>
                
              <br/> 

                <v-flex xs12 sm12 md12>
                
                
                </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
         
          <v-btn @click="prverdialog = false ;" color="blue darken-4"  style="color: white; font-weight:bold"
          >&nbsp; &nbsp;REGRESAR</v-btn>
          <v-btn color="blue darken-1" text @click="funsave">&nbsp; &nbsp; GUARDAR</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

        <v-flex>
            <v-data-table :headers="headers" :items="articulos">
                <template v-slot:item="row">
                    <tr>
                        <td>{{row.item.descripcion}}</td>
                        <td>{{row.item.modelo}}</td>
                        <td>{{row.item.precio}}</td>
                        <td>{{row.item.existencia}}</td>
                        <td>
                            <v-btn class="mx-2" fab dark small color="pink" @click="onButtonClick(row.item)">
                                <v-icon dark>edit</v-icon>
                            </v-btn>
                        </td>
                    </tr>
                </template>
             </v-data-table>
        </v-flex>
    </v-layout>
</template>

<script>
import axios from 'axios'

    export default {
        data(){
            return{
                estatus:0,
                
                prvernuevo:false , 
                prveractualizar:false,
                idseleccionado:0,
                prDescripcion:'',
                prModelo:'',
                prPrecio:0,
                prExistencia:0,
                prActivo:false,
                prverdialog:false , 
                prdialogdescrip : '' , 
                prdialogprecio : 0, 
                
                articulos:[ ],
                 dialog: false,
                    headers: [
                    { text: 'Descripción', value: 'descripcion' },
                    { text: 'Modelo', value: 'modelo' },
                    { text: 'Precio', value: 'precio' },
                    { text: 'Existencia', value: 'existencia' },
//                    { text: 'Actions', value: 'action', sortable: false },
                    ],
                    search:'',
                    
                    editedIndex: -1,
                    editedItem: {
                    
                    },

            }
        },

        computed: {
            formTitle () {
            return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
            },
        },

        watch: {
            dialog (val) {
            val || this.close()
            },
        },

        created () {
            this.initialize()
        },


        methods:{

            onButtonClick(item){ 
                console.log(item.descripcion); 
                console.log(item.precio); 
                let me = this; 
                me.prverdialog = true ; 
                me.prdialogdescrip = item.descripcion  ; 
                me.prdialogprecio = item.precio  ; 

            }, 
            funlimpiar()
            {
               let me = this;
               
                me.prDescripcion='';
                me.prModelo='' ;
                me.prPrecio=0;
                me.prExistencia=0;
                me.prActivo=false;

            },
            funActualizar(trabajadorSeleccionado)
            {
                let me =this;
                me.prveractualizar=true;
                
                 me.idseleccionado=trabajadorSeleccionado.id;
                
            },
            funsave()
            {
                 let me = this;
          
                
                axios.post('api/Articulos/Crear',
                {
                    descripcion:me.prDescripcion, modelo:me.prModelo, precio:me.prPrecio, existencia:me.prExistencia
                }).then(function(response)
                {
                    console.log('si la meti');
                    me.listarArticulos(); 
                    me.prvernuevo= false; 
                    me.funlimpiar();
                    
                }).catch(function(error)
                {
                    console.log(error);
                    console.log (me.prDescripcion +', '+  me.prModelo   +', '+    me.prPrecio   +', '+ me.prExistencia )
                });

            },
            funupdate()
            {
                 let me = this;
                                
                
                axios.put('api/Articulos/Actualizar',
                {
                   idArticulos:me.idseleccionado, Descripcion:me.prDescripcion, Modelo:me.prModelo, precio:me.prPrecio, existencia:me.prExistencia
                }).then(function(response)
                {
                    console.log('si la actualize');
                        me.listarTrabajadores(); 
                        me.prveractualizar= false; 
                        me.funlimpiar();
                    
                }).catch(function(error){console.log(error);
                });

            },

           fungetcolor(valor)
           {
               if (valor==true)
               {
                   return "green";
               }
               return "red";
           }, 

            listarArticulos(){
                let me = this;
                let header={"Access-Control-Allow-Origin": "*",'Content-Type': 'application/json',};
                let configuration ={header:header};
                axios.get('api/Articulos/Listar',configuration).then(function(response)
                {
                    console.log(response);
                    me.articulos=response.data;
                }).catch(function(error)
                {
                    console.log(error)
                                
                });
            },

            initialize () {
                 
                this.listarArticulos();
               
            },

           
            deleteItem (item) {
                console.log(item.activo)
                this.idseleccionado=item.id;
                if (item.activo)
                {this.fundesactivar();} else {this.funactivar();}

                
            },
            fundesactivar()
            {
                let me = this;
                let header={"Access-Control-Allow-Origin": "*",'Content-Type': 'application/json',};
                let configuration ={header:header};
                axios.put('api/Articulos/desactivar/' +  this.idseleccionado,configuration).then(function(response)
                {
                     me.listarTrabajadores(); 
                     me.funlimpiar();
                    //console.log(response);
                   // me.trabajadores=response.data;
                }).catch(function(error){console.log(error);
                });
            },

            funactivar()
            {
                let me = this;
                let header={"Access-Control-Allow-Origin": "*",'Content-Type': 'application/json',};
                let configuration ={header:header};
                axios.put('api/Articulos/activar/' +  this.idseleccionado,configuration).then(function(response)
                {
                    me.listarTrabajadores(); 
                    me.funlimpiar();
                    //console.log(response);
                    //me.trabajadores=response.data;
                }).catch(function(error){console.log(error);
                });
            },

            close () {
                this.dialog = false
                setTimeout(() => {
                    this.editedItem = Object.assign({}, this.defaultItem)
                    this.editedIndex = -1
                }, 300)
            },

            save () {
                if (this.editedIndex > -1) {
                    Object.assign(this.desserts[this.editedIndex], this.editedItem)
                } else {
                    this.desserts.push(this.editedItem)
                }
                this.close()
            }
        }
    }
</script>

