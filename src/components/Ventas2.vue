<template>
    <v-layout align-start>
        <v-flex>
            <!--MAIN --> 
            <v-data-table :headers="headersVenta" :items="ventas" :search="search">
                    <template v-slot:top>
                    <v-toolbar text color="white">
                    <v-toolbar-title>Ventas</v-toolbar-title>
                    
                    <v-spacer></v-spacer>
                    <v-text-field class="text-xs-center" v-model="search" append-icon="search" label="Búsqueda" single-line hide-details></v-text-field>
                    <v-spacer></v-spacer>
                        <v-dialog v-model="dialog" max-width="500px">
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

            <v-flex>
                <v-dialog v-model="prvernuevo" max-width="1100px" color="white" style="background-color:RGBA(255,255,255,1);">
                    

                     <v-card
                        class="mx-auto"
                        max-width="1100px"
                        >
                        <v-card-title class="title font-weight-regular justify-space-between">
                            <span>Nueva Venta </span>
                        </v-card-title>


                         <v-window v-model="prStep">
                            <v-window-item :value="1">
                                <v-card-text>
                                      <v-container grid-list-md>
                                        <v-layout row wrap class="text-xs-right" >
                                            <v-flex   class="text-xs-right" xs6 sm6 md6>
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
                                                
                                            <v-flex  class="text-xs-right ml-4 mt-2" xs12 sm5 md5>
                                                <v-text-field  disabled  v-model="clienteSeleccionado.rfc" label="RFC cliente"></v-text-field>
                                            </v-flex>
                                            
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
                                                <v-icon color="white" large>add_shopping_cart</v-icon>
                                                </v-btn>
                                            </v-flex>
                                            
                                            <v-flex xs12 sm12 md12 class="text-xs-right ml-4 mt-2" >
                                                <v-data-table single-line  :headers="headers" :items="articulosComprar" hide-default-footer >
                                                    <template v-slot:item="row">
                                                        <tr>
                                                            <td xs12 sm12 md12>{{row.item.descripcion}}</td>
                                                            <td>{{row.item.modelo}}</td>
                                                            <!--td>{{row.item.cantidad}}</td-->
                                                            <td    class="text-xs-left" style="color: black; font-weight:bold">
                                                                <v-text-field  style="font-size: 12px;"  type="number" @click="calculaRow(row, row.index)" @change="calculaRow(row, row.index)" v-model="row.item.cantidad ">
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
                
                                                        </tr>
                                                    </template>
                                                </v-data-table>
                                            </v-flex>
                                             
                                            <v-flex   class="text-xs-right" xs6 sm6 md6>
                                                 <v-spacer></v-spacer>
                                            </v-flex>
                                            <v-flex   class="text-xs-right" xs4 sm4 md4>
                                                <strong>SUBTOTAL: $</strong>
                                            </v-flex>
                                            <v-flex   class="text-xs-right" xs2 sm2 md2>
                                                <strong> {{prdocsubtotal }}</strong>
                                            </v-flex>
                                        </v-layout>
                                    </v-container>
                                </v-card-text>
                            </v-window-item>

                            <v-window-item :value="2">
                                <v-card-text>
                                     <v-container grid-list-md>
                                        <v-layout row wrap class="text-xs-right" >
                                            <v-flex xs12 sm12 md12>
                                                <v-data-table  :items="opcionCompra"  hide-default-footer>
                                                    <template v-slot:top>
                                                        <v-toolbar text color="white">
                                                        <v-toolbar-title class="text-center">ABONOS MENSUALES</v-toolbar-title>
                                                        </v-toolbar>
                                                    </template>   
                                                    <template v-slot:item="row">
                                                        <tr>
                                                            <td>{{row.item.deSplazo}}</td>
                                                            <td>{{row.item.deSimporteAbono}}</td>
                                                            <td>{{row.item.deStotalPagar}}</td>
                                                            <td>{{row.item.deSahorro}}</td>
                                                            <td>
                                                                <v-radio-group v-model="prSEL">
                                                                    <v-radio :value="row.item.totalPagar" @change="funVerFinalizar()"  />
                                                                </v-radio-group>
                                                            </td>
                                                        </tr>
                                                    </template>
                                                </v-data-table>
                                            </v-flex>
                                        </v-layout>
                                    </v-container>
                                </v-card-text>
                            </v-window-item>


                            <v-card-actions>
                                <v-btn
                                    :disabled="prStep === 1"
                                    text
                                    @click="prStep--"
                                >
                                Back
                                </v-btn>
                                <v-spacer></v-spacer>
                                <v-btn
                                
                                color="primary"
                                depressed
                                @click="funAvanzar()"
                                >
                                    {{ prAction }} 
                                </v-btn>
                            </v-card-actions>





                         </v-window>


                    </v-card>

                    
                    <v-card v-show="false">
                        
            
                        <v-card-text>
                           
                        </v-card-text>
                        <v-layout row wrap class="text-xs-right" >
                                   
                                </v-layout>
                        
                        <v-card-text v-show="!prverpaso2">
                            <v-container grid-list-md>
                                 
                            </v-container>
                        </v-card-text>

                        <v-card-actions v-show="!prverpaso2">
                            <v-spacer></v-spacer>
                            <v-btn color="blue orange-1" text @click="funlimpiar()">CANCELAR</v-btn>
                            <v-btn color="blue darken-1" text @click="funOpcionesCompra()">SIGUIENTE</v-btn>
                        </v-card-actions>

                        <v-flex xs12 sm12 md12>
                            <v-card-text v-show="!prverpaso3">
                               
                            </v-card-text>
                            <v-card-actions v-show="!prverpaso4">
                                <v-flex justify-center>
                                    <v-btn depressed color="blue darken-1" text @click="funsave()">Finalizar compra</v-btn>
                                </v-flex>
                            </v-card-actions>
                        </v-flex>
                    </v-card>

                    
                </v-dialog>
            </v-flex>
        </v-flex>
    </v-layout>
</template>

<script>
import axios from 'axios'
import { mdiAccount, mdiplus } from "@mdi/js";

    export default {
        data(){
            return{
                prAction : 'SIGUIENTE' , 
                estatus:0,
                prStep : 1 , 
                prvernuevo  :false , 
                prveractualizar:false,
                prverrfc:false,
                prverpaso2:true,
                prverpaso3:true,
                prverpaso4:true,
                prSEL:0,
                idCliente:0,
                clienteSeleccionado:[],
                
                idArticulo:0,
                articuloSeleccionado:[],

                articulos:[],
                articulosComprar:[],
                
                clientes:[],
                ventas:[],

                pridVenta:0,
                pridCliente:0,
                prtotal:0.00,
                prMonto:0,
                prdocsubtotal:0 ,
                prfechaVenta:Date,

                headersVenta: [
                    { text: 'abonos', value: 'idVenta' },
                    { text: 'clave cliente', value: 'idCliente' },
                    { text: 'Nombre' ,value:'nombreCompleto' },
                    { text: 'Total', value: 'total' },
                    { text: 'Fecha', value:'fechaVenta' , sortable: false },
                ],

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
                opcionCompra:[],

                isUpdating: false,

                icons: {
                    mdiAccount,
                    mdiplus
                }
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

            numberWithCommas(x) {
                return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
            }, 

           //dateToYMD(date) {
             //   var strArray=['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
               // var d = date.getDate();
                //var m = strArray[date.getMonth()];
                //var y = date.getFullYear();
                //return '' + (d <= 9 ? '0' + d : d) + '-' + m + '-' + y;
           //},
        
            funAvanzar(){
                let me = this ; 
                if (me.prStep == 1 )
                {
                    me.funOpcionesCompra(); 
                    me.prStep++ ; 
                    me.prAction = 'FINALIZAR COMPRA';
                    return ;  
                }
                if (me.prStep == 2 )
                {
                    me.funsave() ; 
                    me.funlimpiar() ;
                    me.prStep = 1 ; 
                }

            },
            
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

            funCalculaSubtotal()
            {
                var i = this.articulosComprar.length;
                console.log(this.articulosComprar);
                var sum = 0;
                while (--i) sum += this.articulosComprar[i].importe;
                return sum;
            },

            funlimpiar()
            {
               let me = this;  
               
                me.prSEL='';
                me.prvernuevo=false ;
                me.prveractualizar=false;
                me.pridVenta=0;
                me.pridCliente=0;

                
                me.prverpaso2=true;
                me.prverpaso3=true;
                me.prverpaso4=true;

                me.prvernuevo=false ;
                me.prveractualizar=false;
                      
                me.idCliente=0;
                me.clienteSeleccionado=[];
                
                me.idArticulo=0;
                me.articuloSeleccionado=[];

                me.articulos=[];
                me.articulosComprar=[];
                
                me.clientes=[];
                me.ventas=[];

               
                me.prtotal=0.00;
                me.prMonto=0;
                me.prdocsubtotal=0;

                me.prAction = 'SIGUIENTE';

                me.listarClientes();
                me.listarArticulos();
                me.listarVentas();

                const today = new Date();
                const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();             
                
                me.prfechaVenta =  date;
            },

            funVerFinalizar()
            {
                this.prverpaso4=false;
            },

            agregarArticulo(AS){
                this.articulosComprar.push({ 
                    "idArticulo":AS.idArticulo,
                    "descripcion":AS.descripcion,
                    "modelo":AS.modelo,
                    "cantidad":1,
                    "precio":AS.precio,
                    "importe":AS.precio});

                this.prverpaso2=false;
                this.calculaSubTotal();

            },

            calculaRow(row, indice){
                
                this.articulosComprar[indice].importe =this.articulosComprar[indice].cantidad * this.articulosComprar[indice].precio;

                //bills.map(bill => bill.pendingAmount).reduce((acc, bill) => bill + acc);
                this.calculaSubTotal();
            },

            calculaSubTotal()
            {
                this.prdocsubtotal=this.articulosComprar.map(ac => ac.importe).reduce((sumAC,ac) => ac+sumAC);
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
                    
                    me.ventas=response.data;
                    for (var i = 0; i < me.ventas.length; i++) {
                        me.ventas[i].total = me.numberWithCommas(me.ventas[i].total); 
                       // me.ventas[i].fechaVenta = me.ventas[i].fechaVenta.getFullYear()+'-'+(me.ventas[i].fechaVenta.getMonth()+1)+'-'+me.ventas[i].fechaVenta.getDate();     

                    }  
                    //console.log(me.ventas);

                    
                }).catch(function(error)
                {
                    console.log(error)
                                
                });
            },

            funOpcionesCompra(){
                let me = this;
                me.calculaSubTotal();
                me.prMonto = me.prdocsubtotal;
                let header={"Access-Control-Allow-Origin": "*", 'Content-Type': 'application/json',};
                let configuration ={header:header};
                axios.get('api/Ventas/opcionesCompra/' + me.prMonto,configuration).then(function(response)
                {
                    console.log(response);
                    
                    me.opcionCompra=response.data;
                    me.prverpaso3=false;

                }).catch(function(error){
                    console.log(error);
                });
            },

            funsave()
            {
                 let me = this;

                axios.post('api/Ventas/Crear',
                {
                    idCliente:me.clienteSeleccionado.idCliente, total:me.prSEL, fechaVenta:me.prfechaVenta,
                }).then(function(response)
                {
                    console.log('si la meti');
                    me.listarVentas(); 
                    me.prvernuevo= false; 
                    
                    me.funlimpiar();
                    
                    
                }).catch(function(error)
                {
                    console.log(error);
                    console.log(me.clienteSeleccionado.idCliente+', '+  me.prSEL  +', '+  me.prfechaVenta );
                });

            },

            initialize () {
                 
                this.listarClientes();
                this.listarArticulos();
                this.listarVentas();

                const today = new Date();
                const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();             
                
                this.prfechaVenta =  date;
               
            },

        }
    }
</script>
