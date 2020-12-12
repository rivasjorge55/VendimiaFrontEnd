<template>
    <v-layout align-start>
        <template>
            <span class="headline">Configuración</span>
            <v-divider class="mx-4"  inset vertical></v-divider>
            <v-row>
                <v-col cols="12" sm="6">
                    <v-flex xs12 sm12 md12>
                        <v-text-field
                            type="number" 
                            step="any"
                            min="0"
                            ref="input"
                            :rules="[numberRule]"
                            v-model.number="prtazaFinanciamiento"  
                            @change="funDosDecimales(prtazaFinanciamiento)"
                        label="Taza de financiamiento"></v-text-field>
                    </v-flex>
                </v-col>
            </v-row>
            
            <v-row>
                <v-col cols="12" sm="6">
                    <v-flex xs12 sm12 md12>
                        <v-text-field v-model="prporcentajeEnganche" label="Porcentaje maximo"></v-text-field>
                    </v-flex>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" sm="6">
                    <v-flex xs12 sm12 md12>
                        <v-text-field 
                            type="number"   
                            step="any"
                            min="0"
                            ref="input"
                            :rules="[isInt]"
                            v-model.number="prplazoMaximo"  
                         label="Plazo maximo"></v-text-field>
                    </v-flex>   
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" sm="6">
                    <v-btn color="blue darken-1" text @click="funupdate">GUARDAR</v-btn>    
                </v-col>
            </v-row>
            
        </template>
       
    </v-layout>
</template>




<script>
import axios from 'axios'

    export default {
        data(){
            return{
                pridConfiguracion:1,
                prtazaFinanciamiento:0,
                prporcentajeEnganche:0,
                prplazoMaximo:0,
                configuraciones:[],
                rules: [
                    value => !!value || 'Required.',
                    value => (value && value.length >= 3) || 'Min 3 characters',
                ],
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
 
       

        created () {
            this.initialize()
        },


        methods:{
            funlimpiar()
            {
               let me = this;
               
                me.pridConfiguracion=1,
                me.configuraciones=[];
                me.prtazaFinanciamiento=0 ;
                me.prporcentajeEnganche=0;
                me.prplazoMaximo=0;
                
            },
            
           
            funupdate()
            {
                 let me = this;
                                
                
                axios.put('api/Configuraciones/Actualizar',
                {
                   idConfiguracion:me.pridConfiguracion, plazoMaximo:me.prplazoMaximo, porcentajeEnganche:me.prporcentajeEnganche, tazaFinanciamiento:me.prtazaFinanciamiento
                }).then(function(response)
                {
                    console.log (me.pridConfiguracion + ', '+ me.prplazoMaximo + ', '+ me.prporcentajeEnganche + ', '+ me.prtazaFinanciamiento)
                    console.log('si la actualize');
                        me.funlimpiar();
                        me.MostrarConfiguracion(); 
                        
                    
                }).catch(function(error)
                {
                    console.log('Actualizar');
                    console.log(error);
                    console.log (me.pridConfiguracion + ', '+ me.prplazoMaximo + ', '+ me.prporcentajeEnganche + ', '+ me.prtazaFinanciamiento)
                });

            },

            MostrarConfiguracion(){
                let me = this;
                let header={"Access-Control-Allow-Origin": "*",'Content-Type': 'application/json',};
                let configuration ={header:header};
                axios.get('api/Configuraciones/Listar',configuration).then(function(response)
                {
                    console.log(response);
                    
                    me.configuraciones=response.data[0];
                    console.log(me.configuraciones);
                    
                    me.prtazaFinanciamiento=me.configuraciones.tazaFinanciamiento;
                    me.prporcentajeEnganche=me.configuraciones.porcentajeEnganche
                    me.prplazoMaximo=me.configuraciones.plazoMaximo
                }).catch(function(error)
                {
                    console.log(error)
                                
                });
            },

            initialize () {
                 
                this.MostrarConfiguracion();
               
            },

             funDosDecimales(val)
           {
               return val.toFixed(2);

           },

            isInt(n) 
            {
                if (Number(n) === n && n % 1 === 0) return true;
                return 'Favor de introducir un numero entero'; //
            },

        }
    }
</script>

