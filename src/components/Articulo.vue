<template>
    <v-layout align-start>
        <v-flex>
            <v-dialog v-model="prvernuevo" max-width="700px" color="white" style="background-color:RGBA(255,255,255,1);">
                <v-card>
                    <v-card-title>
                    <span class="headline">Agregar Nuevo</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container grid-list-md>
                            <v-layout wrap>
                                <!-- Comment 
                                <v-flex xs12 sm12 md12>
                                    <v-text-field v-model="" label="idarticulo"></v-text-field>
                                </v-flex>--> 
                                <v-flex xs12 sm12 md12>
                                    <v-text-field v-model="prDescripcion" label="Descripción "> </v-text-field>
                                </v-flex>

                                <v-flex xs12 sm12 md12>
                                    <v-text-field v-model="prModelo" label="Modelo "> </v-text-field>
                                </v-flex>

                                <v-flex xs6 sm6 md6>
                                    <v-text-field 
                                        type="number" 
                                        step="any"
                                        min="0"
                                        ref="input"
                                        :rules="[numberRule]"
                                        v-model.number="prPrecio"  
                                        @change="funprPrecioDosDecimales()"
                                        label="Precio "> </v-text-field>
                                </v-flex>

                                <v-flex xs6 sm6 md6>
                                    <v-text-field 
                                        type="number"   
                                        step="any"
                                        min="0"
                                        ref="input"
                                        :rules="[isInt]"
                                        v-model.number="prExistencia"  
                                        label="Existencia "> </v-text-field>
                                </v-flex>
                                
                            </v-layout>
                        </v-container>
                    </v-card-text>
            
                    <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue orange-1" text @click="prvernuevo=false;">CANCELAR</v-btn>
                    <v-btn color="blue darken-1" text @click="funsave">GUARDAR</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

            <v-dialog v-model="prveractualizar" max-width="700px" color="white" style="background-color:RGBA(255,255,255,1);">
                <v-card>
                    <v-card-title>
                    <span class="headline">Editar</span>
                    </v-card-title>
        
                    <v-card-text>
                        <v-container grid-list-md>
                            <v-layout wrap>
                                <v-flex xs12 sm12 md12>
                                    <v-text-field v-model="prDescripcion" label="Descripción "> </v-text-field>
                                </v-flex>

                                <v-flex xs12 sm12 md12>
                                    <v-text-field v-model="prModelo" label="Modelo "> </v-text-field>
                                </v-flex>

                                <v-flex xs6 sm6 md6>
                                    <v-text-field v-model="prPrecio" label="Precio "> </v-text-field>
                                </v-flex>

                                <v-flex xs6 sm6 md6>
                                    <v-text-field v-model="prExistencia" label="Existencia "> </v-text-field>
                                </v-flex>
                                
                            </v-layout>
                        </v-container>
                    </v-card-text>
        
                    <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue orange-1" text @click="prveractualizar=false;">CANCELAR</v-btn>
                    <v-btn color="blue darken-1" text @click="funupdate">ACTUALIZAR</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

             <v-data-table :headers="headers" :items="articulos" :search="search">
                  <template v-slot:top>
                    <v-toolbar text color="white">
                    <v-toolbar-title>Artículos</v-toolbar-title>
                    
                    <v-spacer></v-spacer>
                    <v-text-field class="text-xs-center" v-model="search" append-icon="search" label="Búsqueda" single-line hide-details></v-text-field>
                    <v-spacer></v-spacer>
                        <v-dialog v-model="dialog" max-width="500px">
                            <template v-slot:activator="{}">
                            <v-btn color="primary" dark class="mb-2"  @click="prvernuevo=true;" >Agregar</v-btn>
                            </template>
                        </v-dialog>
                    </v-toolbar>
                </template>    
                <template v-slot:item="row">
                    <tr>
                        <td>{{row.item.descripcion}}</td>
                        <td>{{row.item.modelo}}</td>
                        <td>{{row.item.precio}}</td>
                        <td>{{row.item.existencia}}</td>
                        <td>
                            <div v-if="row.item.activo">Activo</div>
                            <div v-else>Inactivo</div>
                        </td>
                        <td>
                            <v-btn class="mx-2" fab dark small color="pink" @click="funActualizar(row.item)">
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
                    
                    articulos:[],
                    dialog: false,
                    headers: [
                    { text: 'Descripción', value: 'descripcion' },
                    { text: 'Modelo', value: 'modelo' },
                    { text: 'Precio', value: 'precio' },
                    { text: 'Existencia', value: 'existencia' },
                    { text: 'Activo', value: 'activo' },
                    { text: 'Actions', value: 'action', sortable: false },
                    ],
                    search:'',
                    
                    editedIndex: -1,

                    editedItem: {},

                    numberRule: val => {
                        if(val < 0) return 'Favor de introducir un numero valido'
                            return true;
                    },

                    ReglaNumberoEntero: val => {
                        if(val < 1) return 'Favor de introducir un numero valido'
                            return true;
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
            funlimpiar()
            {
               let me = this;
               
                me.prDescripcion='';
                me.prModelo='' ;
                me.prPrecio=0;
                me.prExistencia=0;
                me.prActivo=false;

            },

            funActualizar(articuloSeleccionado)
            {
                let me =this;
                me.prveractualizar=true;
                
                 me.idseleccionado=articuloSeleccionado.idArticulo;
                 me.prDescripcion=articuloSeleccionado.descripcion;
                 me.prModelo=articuloSeleccionado.modelo;
                 me.prPrecio=articuloSeleccionado.precio;
                 me.prExistencia=articuloSeleccionado.existencia;
                
            },

            funsave()
            {
                 let me = this;
                //me.prPrecio= me.formatMoney(me.prPrecio);
                
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
                   idArticulo:me.idseleccionado, descripcion:me.prDescripcion, modelo:me.prModelo, precio:me.prPrecio, existencia:me.prExistencia
                }).then(function(response)
                {
                    console.log('si la actualize');
                        me.listarArticulos(); 
                        me.prveractualizar= false; 
                        me.funlimpiar();
                    
                }).catch(function(error)
                {
                    console.log('Actualizar');
                    console.log(error);
                    console.log (me.idseleccionado + ', '+ me.prDescripcion +', '+  me.prModelo   +', '+    me.prPrecio   +', '+ me.prExistencia )
                });

            },

          
            funprPrecioDosDecimales()
           {
                
               this.prPrecio= this.prPrecio.toFixed(2);
               
               return true;

           },

            isInt(n) 
            {
                        if (Number(n) === n && n % 1 === 0) return true;
                        return 'Favor de introducir un numero entero'; //
            },

           funprExistenciaEntero()
           {
               this.prExistencia= this.prExistencia.toFixed(0);
               
               return true;
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

