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
                                
                                <v-flex xs12 sm12 md12>
                                    <v-text-field v-model="prnombre" label="Nombre "></v-text-field>
                                </v-flex> 

                                <v-flex xs12 sm12 md12>
                                    <v-text-field v-model="prPrimerApellido" label="Primer Apellido "></v-text-field>
                                </v-flex>

                                <v-flex xs12 sm12 md12>
                                    <v-text-field v-model="prSegundoApellido" label="Segundo Apellido "> </v-text-field>
                                </v-flex>

                                <v-flex xs12 sm12 md12>
                                    <v-text-field v-model="prRFC" label="RFC "> </v-text-field>
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
                                        <v-text-field v-model="prnombre"  label="Nombre "></v-text-field>
                                    </v-flex>

                                    <v-flex xs12 sm12 md12>
                                        <v-text-field v-model="prPrimerApellido" label="Primer Apellido "></v-text-field>
                                    </v-flex>

                                    <v-flex xs12 sm12 md12>
                                        <v-text-field v-model="prSegundoApellido" label="Segundo Apellido "> </v-text-field>
                                    </v-flex>

                                    <v-flex xs12 sm12 md12>
                                        <v-text-field v-model="prRFC" label="RFC "> </v-text-field>
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

            <v-data-table :headers="headers" :items="clientes" :search="search">
                  <template v-slot:top>
                    <v-toolbar text color="white">
                    <v-toolbar-title>Clientes</v-toolbar-title>
                    <v-divider class="mx-4"  inset vertical></v-divider>
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
                        <td>{{row.item.nombre}}</td>
                        <td>{{row.item.primerApellido}}</td>
                        <td>{{row.item.segundoApellido}}</td>
                        <td>{{row.item.rfc}}</td>
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
                
                   
                counterlen : 3 , 
                isUpdating: false,
                value: null,
                isLoading : false , 
                     
                

                estatus:0,
                prnombre:'', 
                prPrimerApellido:'',
                prSegundoApellido:'',
                prRFC:'',
                prvernuevo:false , 
                prveractualizar:false,
                idseleccionado:0,

                clientes:[],
                 dialog: false,
                    headers: [
                    { text: 'Nombre', value: 'nombre' },
                    { text: 'Primer apellido', value: 'primerApellido' },
                    { text: 'Segundo apellido', value: 'segundoApellido' },
                    { text: 'RFC', value: 'rfc' },
                    { text: 'Actualizar', value:'action' , sortable: false },
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

      

        created () {
            this.initialize()
        },
          watch: 
        {
            dialog (val) {
            val || this.close()
            },

            isUpdating (val) {
              if (val) {
                setTimeout(() => (this.isUpdating = false), 3000)
              }
          
            },
        }, 



        methods:{

              filterObject(item, queryText, itemText) {
            if (queryText.length < 3) return null ; 
            return (
              item.descrip.toLocaleLowerCase().indexOf(queryText.toLocaleLowerCase()) > -1 ||
              item.id.toLocaleLowerCase().indexOf(queryText.toLocaleLowerCase()) > -1
            );
          }, 

            funlimpiar()
            {
               let me = this;
               
                me.prnombre='';
                me.prvernuevo=false ;
                me.prveractualizar=false;
                me.prselectrol=0;
                me.prselecttipo=0;
            },

            funActualizar(clienteSeleccionado)
            {
                let me =this;
                me.prveractualizar=true;
                me.prnombre = clienteSeleccionado.nombre;
                me.prPrimerApellido = clienteSeleccionado.primerApellido;
                me.prSegundoApellido = clienteSeleccionado.segundoApellido;
                me.prRFC = clienteSeleccionado.rfc;
     
                 me.idseleccionado=clienteSeleccionado.idCliente;
                
            },

            funsave()
            {
                 let me = this;
                      
                axios.post('api/Clientes/Crear',
                {
                    nombre:me.prnombre, primerApellido:me.prPrimerApellido, segundoApellido:me.prSegundoApellido,rfc:me.prRFC,
                }).then(function(response)
                {
                    console.log('si la meti');
                    me.listarClientes(); 
                    me.prvernuevo= false; 
                    me.funlimpiar();
                    
                }).catch(function(error)
                {
                    console.log(error);
                    console.log(me.prnombre+', '+  me.prPrimerApellido  +', '+  me.prSegundoApellido +', '+ me.prRFC );
                });

            },

            funupdate()
            {
                 let me = this;
                                         
                axios.put('api/Clientes/Actualizar',
                {
                   idCliente:me.idseleccionado, nombre:me.prnombre, primerApellido:me.prPrimerApellido, segundoApellido:me.prSegundoApellido, rfc:me.prRFC, 
                }).then(function(response)
                {
                    console.log('si la actualize');
                        me.listarClientes(); 
                        me.prveractualizar= false; 
                        me.funlimpiar();
                    
                }).catch(function(error)
                {
                    console.log(error);
                    console.log(me.idseleccionado+', '+me.prnombre+', '+  me.prPrimerApellido  +', '+  me.prSegundoApellido +', '+ me.prRFC );

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

            listarClientes(){ 
                let me = this;
                let header={"Access-Control-Allow-Origin": "*",'Content-Type': 'application/json',};
                let configuration ={header:header};
                axios.get('api/Clientes/Listar',configuration).then(function(response)
                {
                    //console.log(response);
                    me.clientes=response.data;
                }).catch(function(error){console.log(error);
                });
            },

            initialize () {
                 
                this.listarClientes();
               
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
                axios.put('api/Clientes/desactivar/' +  this.idseleccionado,configuration).then(function(response)
                {
                     me.listarClientes(); 
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
                axios.put('api/Trabajadores/activar/' +  this.idseleccionado,configuration).then(function(response)
                {
                    me.listarClientes(); 
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


