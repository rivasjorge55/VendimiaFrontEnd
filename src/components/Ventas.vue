<template>
    <v-layout align-start>
        
            <v-data-table :headers="headersVenta" :items="ventas" :search="search">
                  <template v-slot:top>
                    <v-toolbar text color="white">
                    <v-toolbar-title>Ventas</v-toolbar-title>
                    
                    <v-spacer></v-spacer>
                    <v-text-field class="text-xs-center" v-model="search" append-icon="search" label="Búsqueda" single-line hide-details></v-text-field>
                    <v-spacer></v-spacer>
                        <v-dialog v-model="dialog" max-width="1400px">
                            <template v-slot:activator="{}">
                            <v-btn color="primary" dark class="mb-2"  @click="prvernuevo=true;" >Nueva Venta</v-btn>
                            </template>
                        </v-dialog>
                    </v-toolbar>
                </template>    
                <template v-slot:item="row">
                    <tr>
                        <td>{{row.item.idVenta}}</td>
                        <td>{{row.item.idCliente}}</td>
                        <td>{{row.item.nombreCompleto}}</td>
                        <td>{{row.item.total}}</td>
                        <td>{{row.item.fechaVenta}}</td>
                    </tr>
                </template>
            </v-data-table>


        <!--v-layout row wrap class="text-xs-right" >
            
                
            <v-flex   class="text-xs-right" xs10 sm10 md10>
                <strong>SUBTOTAL: $</strong>
            </v-flex>
            <v-flex   class="text-xs-right" xs2 sm2 md2>
                <strong> {{prdocsubtotal=parseFloat(FunCalculaSubtotal).toFixed(2) | numeral('0,0.00') }}</strong>
            </v-flex>
        </v-layout-->
        <!--v-autocomplete
            v-model="value"
            :loading="isLoading"
            :items="items"
            :filter="filterObject"
            filled
            hide-no-data
            solo
            color="blue-grey lighten-2"
            label="Select"
            item-text="descrip"
            return-object
            
        ></v-autocomplete-->

        <v-layout row wrap class="text-xs-right" >
            <v-flex   class="text-xs-right" xs12 sm12 md7>
                <v-autocomplete
                    v-model="clienteSeleccionado"
                    :disabled="isUpdating"
                    :items="clientes"
                    :filter="filterObject"
                    filled
                    hide-no-data
                    solo
                    color="blue-grey lighten-2"
                    label="Seleccionar cliente"
                    item-text="nombreCompleto"
                    return-object
                
                ></v-autocomplete>
            </v-flex>
                
            <v-flex   class="text-xs-right ml-4 mt-2" xs12 sm12 md4>
                <v-text-field disabled  v-model="clienteSeleccionado.rfc" label="RFC cliente"></v-text-field>
            </v-flex>
            <br/>
                <v-flex xs11 sm11 md11>
                <v-autocomplete
                    v-model="articuloSeleccionado"
                    :disabled="isUpdating"
                    :items="articulos"
                    filled
                    solo 
                    color="blue-grey lighten-2"
                    label="Select"
                    item-text="descripcion"
                    return-object
                ></v-autocomplete>
            </v-flex>

            <v-flex xs1 sm1 md1>
                <v-btn class="mx-2"  fab dark color="blue" @click="agregarArticulo(articuloSeleccionado)" >
                    +
                </v-btn>
            </v-flex>

            <v-data-table :headers="headers" :items="articulosComprar" hide-default-footer >
                <template v-slot:item="row">
                    <tr>
                        <td xs12 sm12 md12>{{row.item.descripcion}}</td>
                        <td>{{row.item.modelo}}</td>
                        <!--td>{{row.item.cantidad}}</td-->
                        <td    class="text-xs-left" style="color: black; font-weight:bold">
                            <v-text-field  style="font-size: 12px;"  type="number" @change="calculaRow(row, row.index)" v-model="row.item.cantidad ">
                            </v-text-field>
                        </td>
                        <td    class="text-xs-left" style="color: black; font-weight:bold">
                            <v-text-field  style="font-size: 12px;"  disabled v-model="row.item.precio ">
                            </v-text-field>
                        </td>
                        <td    class="text-xs-left" style="color: black; font-weight:bold">
                            <v-text-field  style="font-size: 12px;"  disabled v-model="row.item.importe ">
                            </v-text-field>
                        </td>

                        <!--td>{{row.item.precio}}</td>
                        <td>{{row.item.importe}}</td-->
                        
                    </tr>
                </template>
             </v-data-table>


        </v-layout>
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
                idCliente:0,
                clienteSeleccionado:[],
                
                idArticulo:0,
                articuloSeleccionado:[],

                articulos:[],
                articulosComprar:[],
                
                clientes:[],
                ventas:[],

                 headersVenta: [
                    { text: 'folio venta', value: 'idVenta' },
                    { text: 'clave cliente', value: 'idCliente' },
                    { text: 'Nombre' ,value:'nombreCompleto' },
                    { text: 'Total', value: 'total' },
                    { text: 'Fecha', value:'fechaVenta' , sortable: false },
                ],

                 headers: [
                    { text: 'Descripcion artículo', value: 'descripcion' },
                    { text: 'Modelo', value: 'modelo' },
                    { text: 'Cantidad' ,value:'cantidad' },
                    { text: 'Precio', value: 'precio' },
                    { text: 'Importe', value:'importe' , sortable: false },
                ],

                dialog: false,
                editedIndex: -1,
                editedItem: {},  
                
                loading: false,
                items: [],
                search: null,
                select: null,

                nombreClientes :[],

                isUpdating: false,
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

            isUpdating (val) {
              if (val) {
                setTimeout(() => (this.isUpdating = false), 3000)
              }
          
            },

            //search (val) {
            //    val && val !== this.select && this.querySelectionsClientes(val)
            //},
        },

        created () {
            this.initialize()
        },

        methods:{
            //querySelectionsClientes (c) {
            //    this.loading = true
            //    //ajax query simulado
            //    setTimeout(() => {
            //        this.items = this.clientes.filter(e => {
            //            return (e || '').toLowerCase().indexOf((c || '').toLowerCase()) > -1
            //        })
            //        this.loading = false
            //    }, 500)
            //},

            agregarArticulo(AS){
                this.articulosComprar.push({ "idArticulo":AS.idArticulo,
                                        "descripcion":AS.descripcion,
                                        "modelo":AS.modelo,
                                        "cantidad":1,
                                        "precio":AS.precio,
                                        "importe":AS.precio});

            },

            calculaRow(row, indice){
                console.log(row);
                this.articulosComprar[indice].importe =this.articulosComprar[indice].cantidad*this.articulosComprar[indice].precio;
            },

            filterObject(item, queryText, itemText) {
                if (queryText.length < 3) return null ; 
                return (
                    item.nombre.toLocaleLowerCase().indexOf(queryText.toLocaleLowerCase()) > -1 ||
                    item.primerApellido.toLocaleLowerCase().indexOf(queryText.toLocaleLowerCase()) > -1||
                    item.segundoApellido.toLocaleLowerCase().indexOf(queryText.toLocaleLowerCase()) > -1
                );
            },

            listarClientes(){ 
                let me = this;
                let header={"Access-Control-Allow-Origin": "*",'Content-Type': 'application/json',};
                let configuration ={header:header};
                axios.get('api/Clientes/Listar',configuration).then(function(response)
                {
                    console.log(response.data);
                    
                    me.clientes=response.data
                }).catch(function(error){console.log(error);
                });
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

            listarVentas(){
                let me = this;
                let header={"Access-Control-Allow-Origin": "*",'Content-Type': 'application/json',};
                let configuration ={header:header};
                axios.get('api/Ventas/vw_Ventas',configuration).then(function(response)
                {
                    console.log(response);
                    me.ventas=response.data;
                }).catch(function(error)
                {
                    console.log(error)
                                
                });
            },

            initialize () {
                 
                this.listarClientes();
                this.listarArticulos();
               
            },

        }
    }
</script>
