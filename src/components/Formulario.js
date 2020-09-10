import React, {useState, useEffect} from 'react';
import styled from '@emotion/styled'
import useMoneda from '../hooks/useMoneda';
import useCriptomoneda from '../hooks/useCriptomoneda';
import axios from 'axios';
import Error from './Error'

const Boton = styled.input `
    margin-top: 20px;
    font-weight: bold;
    font-size: 20px;
    padding: 10px;
    background-color: #66A2FE;
    border: none;
    width: 100%;
    border-radius: 10px;
    color: #fff;
    transition: background-color .3s ease;


    &:hover{
        background-color: #326AC0;
        cursor:pointer;
    }
`;


const Formulario = ({guardarMoneda, guardarCriptomoneda}) => {

    //state del listado de criptomonedas
    const[listadocripto, guardarCriptomonedas] = useState([]);
    const [error, guardarError] = useState(false);

    const MONEDAS = [
        { codigo: 'USD', nombre: 'Dolar Estadounidense'},
        { codigo: 'MXN', nombre: 'Peso Mexicano'},
        { codigo: 'EUR', nombre: 'Euro'},
        { codigo: 'GBP', nombre: 'Libra Esterlina'},
        { codigo: 'ARS', nombre: 'Peso Argentino'}

    ]
    //useMoneda
    const [moneda, SelectMonedas] = useMoneda('Elige tu moneda', '', MONEDAS);


    //useCriptomoneda
    const[criptomoneda, SelectCripto] = useCriptomoneda ('Elige tu criptomoneda', '', listadocripto);

    //ejecutar llamado a la API
    useEffect( () => {
        const consultarAPI = async () => {
            const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

            const resultado = await axios.get(url);

            guardarCriptomonedas(resultado.data.Data);

        }
        consultarAPI();
        }, []);
        
    //when user do submit the form
    const cotizarMoneda = e => {
        e.preventDefault();

        //validar si ambos campos estan llenos
        if(moneda === '' || criptomoneda === ''){
            guardarError(true);
            return;
        }

        //pasar los datos al componente principal
        guardarError(false);
        guardarMoneda(moneda);
        guardarCriptomoneda(criptomoneda);
    }
    return ( 
        <form
            onSubmit={cotizarMoneda}
        >

         {error ? <Error mensaje="Todos los campos son obligatorios"/> : null}
            <SelectMonedas
                moneda={moneda}
            />
            <SelectCripto
                criptomoneda={criptomoneda}
            />
            <Boton
                type="submit"
                value="Calcular"
            ></Boton>
        </form>
     );
}
 
export default Formulario;