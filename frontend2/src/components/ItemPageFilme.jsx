import React, { useEffect, useState } from 'react';
import HomeStyle from '../styles/home'
import "./ContentSection.css"
import styled from 'styled-components';
import Navbar from './Navbar'
import { Routes, Route, useParams} from "react-router-dom";
import{toast} from 'react-toastify';
import axios from 'axios';
import Avaliacao from './Avaliacao';
import { Button } from '@mui/material';
import Review from './Review';

const Paia = styled.div `

width: 100vw;
display: flex;
justify-content: center;
`

const Title = styled.h1
`
color: white;
font-size: 100px;
`;

const Info = styled.h1
`
color: white;
font-size: 25px;
padding:10px
`;
const Container = styled.div`

  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  background-color:#54141d;
  margin-bottom: 50px;
`;
const ContainerReview = styled.div`
  margin-top: 10px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  background-color: #262626;
  color:white;
  border-radius:10%;
  margin-bottom: 20px;
`;
const ItemPage = () => {

  const parametros = useParams();
  const idFilmeCerto = parseInt(parametros.id);

  const [buttonPopup,setButtonPopup] = useState(false);
  const [filmes, setFilmes] = useState([]);
  const [filmecorreto, setFilmecorreto] = useState(null);
  const [avaliacoes, setAvaliacoes] = useState([])
  const [avaliacaoCorreta, setAvaliacaocorreta] = useState([])

  const getFilmes = async () => {
    try {
      console.log("Starting request to /filmes");
      const res = await axios.get("http://localhost:8800/filmes");
      console.log("Response received:", res.data);
      setFilmes(res.data);
    } catch (error) {
      console.error("Error fetching filmes:", error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getFilmes();
  }, []);

  const getAvaliacoes = async () => {
    try {
      console.log("Starting request to /avaliacoes");
      const res = await axios.get("http://localhost:8800/avaliacoes");
      console.log("Response received:", res.data);
      setAvaliacoes(res.data);
    } catch (error) {
      console.error("Error fetching avaliacoes:", error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getAvaliacoes();
  }, []);

  useEffect(() => {
    if (filmes.length > 0) {
      console.log("Filmes loaded:", filmes);
      const filmeEncontrado = filmes.find(filme => filme.idfilme === idFilmeCerto);
      if (filmeEncontrado) {
        setFilmecorreto(filmeEncontrado);
        console.log("Filme encontrado:", filmeEncontrado);
      } else {
        console.log("Filme não encontrado");
      }
    }
  }, [filmes, idFilmeCerto]);

  useEffect(() => {
    if (avaliacoes.length > 0) {
      console.log("avaliacoes loaded:", avaliacoes);
      const avaliacaoEncontrada = avaliacoes.filter(avaliacao => avaliacao.FK_idfilme === idFilmeCerto);
      if (avaliacaoEncontrada.length >0 ) {
        setAvaliacaocorreta(avaliacaoEncontrada);
        console.log("Avaliação encontrada:", avaliacaoEncontrada);
      } else {
        console.log("Avaliação não encontrada");
      }
    }
  }, [avaliacoes, idFilmeCerto]);

return (
  <div>
    <HomeStyle></HomeStyle>
    <Navbar></Navbar>
      <section className="movie-section">
          <Paia>
          <Container>
            <Title>
              {filmecorreto ? filmecorreto.titulofilme : "Carregando..."}
            </Title>
            <img src={filmecorreto ? filmecorreto.urlfilme : "Carregando..."} width="75%"></img>
            <Info>
             Diretor: {filmecorreto ? filmecorreto.diretorfilme : "Carregando..."}
            </Info>
            <Info>
              Ano de Lançamento: {filmecorreto ? filmecorreto.anolancamentofilme : "Carregando..."}
            </Info>
            <Info>
              Elenco: {filmecorreto ? filmecorreto.elencofilme : "Carregando..."}
            </Info>
            <Info>
              País: {filmecorreto ? filmecorreto.paisfilme : "Carregando..."}
            </Info>
            <Info>
              Gênero: {filmecorreto ? filmecorreto.generofilme : "Carregando..."}
            </Info>
            <Info>
              Avaliações:
            </Info>
            <ContainerReview>
              {avaliacaoCorreta.map((item,i)=> (
                <Avaliacao type={"filme"} item={item} key={i}></Avaliacao>
              ))}
            </ContainerReview>
            <Button onClick={()=> setButtonPopup(true)} sx={{
              backgroundColor: "#f54545",
              marginBottom: "20px"
            }} variant="contained">ENVIAR UMA AVALIAÇÃO:</Button>
            <Review trigger={buttonPopup} setTrigger={setButtonPopup} id={idFilmeCerto} idType="FK_idfilme"></Review>
          </Container>
          </Paia>
          <div className="items-container">
          </div>
      </section>
  </div>
)
};

export default ItemPage;