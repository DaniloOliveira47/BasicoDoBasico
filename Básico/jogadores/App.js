import React, { useEffect, useState } from 'react';
import {
  StyleSheet, Text, View, FlatList, TextInput, Button, Alert, TouchableOpacity, ScrollView, Image
} from 'react-native';

export default function App() {
  const API_URL = 'http://192.168.2.11:3000/jogadores';

  const [jogadores, setJogadores] = useState([]);
  const [loading, setLoading] = useState(true);

  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [posicao, setPosicao] = useState('');
  const [imagem, setImagem] = useState('');  // <-- campo novo
  const [editingId, setEditingId] = useState(null);

  const fetchJogadores = () => {
    setLoading(true);
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        setJogadores(data);
        setLoading(false);
      })
      .catch(() => {
        Alert.alert('Erro', 'Não foi possível carregar jogadores');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchJogadores();
  }, []);

  const criarJogador = () => {
    if (!nome || !idade || !posicao) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
      return;
    }

    const body = {
      nome,
      idade: parseInt(idade),
      posicao,
      imagem
    };

    console.error('Enviando dados:', body); // Adicione este log

    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
      .then(res => {
        console.error('Resposta recebida:', res); // Adicione este log
        return res.json();
      })
      .then(data => {
        console.error('Dados recebidos:', data); // Adicione este log
        limparFormulario();
        fetchJogadores();
        Alert.alert('Sucesso', 'Jogador criado!');
      })
      .catch((error) => {
        console.error('Erro:', error); // Adicione este log
        Alert.alert('Erro', 'Falha ao criar jogador');
      });
  };
  const atualizarJogador = () => {
    if (!nome || !idade || !posicao) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
      return;
    }

    const body = {
      nome,
      idade: parseInt(idade),
      posicao,
      imagem
    };

    console.log('Atualizando jogador:', editingId, 'com dados:', body);

    fetch(`${API_URL}/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
      .then(res => res.json())
      .then(() => {
        limparFormulario();
        fetchJogadores();
        Alert.alert('Sucesso', 'Jogador atualizado!');
      })
      .catch((error) => {
        console.error('Erro ao atualizar:', error);
        Alert.alert('Erro', 'Falha ao atualizar jogador');
      });
  };
  const deletarJogador = (id) => {
    Alert.alert(
      'Confirmar exclusão',
      'Quer mesmo deletar esse jogador?',
      [
        { text: 'Cancelar' },
        {
          text: 'Sim',
          onPress: () => {
            fetch(`${API_URL}/${id}`, { method: 'DELETE' })
              .then(() => {
                fetchJogadores();
                Alert.alert('Sucesso', 'Jogador deletado');
              })
              .catch(() => Alert.alert('Erro', 'Falha ao deletar jogador'));
          }
        }
      ]
    );
  };

  const limparFormulario = () => {
    setNome('');
    setIdade('');
    setPosicao('');
    setImagem('');
    setEditingId(null);
  };

  const editarJogador = (jogador) => {
    setNome(jogador.nome);
    setIdade(jogador.idade.toString());
    setPosicao(jogador.posicao);
    setImagem(jogador.imagem ?? '');
    setEditingId(jogador.id);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Carregando jogadores...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container} >

      <Text style={styles.title}>
        {editingId ? 'Editar Jogador' : 'Cadastrar Novo Jogador'}
      </Text>

      <TextInput
        placeholder="Nome"
        style={styles.input}
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        placeholder="Idade"
        style={styles.input}
        value={idade}
        onChangeText={setIdade}
        keyboardType="numeric"
      />

      <TextInput
        placeholder="Posição"
        style={styles.input}
        value={posicao}
        onChangeText={setPosicao}
      />

      <TextInput
        placeholder="Link da Imagem"
        style={styles.input}
        value={imagem}
        onChangeText={setImagem}
      />

      {editingId ? (
        <>
          <Button title="Atualizar Jogador" onPress={atualizarJogador} />
          <View style={{ marginVertical: 8 }} />
          <Button title="Cancelar" color="gray" onPress={limparFormulario} />
        </>
      ) : (
        <Button title="Cadastrar Jogador" onPress={criarJogador} />
      )}

      <View style={{ height: 40 }} />

      <Text style={styles.title}>Lista de Jogadores</Text>

      {jogadores.length === 0 ? (
        <Text>Nenhum jogador cadastrado.</Text>
      ) : (
        <FlatList
          data={jogadores}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.jogador}>
              {item.imagem ? (
                <Image
                  source={{ uri: item.imagem }}
                  style={styles.imagem}
                  resizeMode="cover"
                />
              ) : null}

              <Text style={styles.nome}>{item.nome}</Text>
              <Text>Idade: {item.idade}</Text>
              <Text>Posição: {item.posicao}</Text>

              <View style={styles.botoes}>
                <TouchableOpacity
                  style={[styles.botao, { backgroundColor: '#4caf50' }]}
                  onPress={() => editarJogador(item)}
                >
                  <Text style={styles.textBotao}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.botao, { backgroundColor: '#f44336' }]}
                  onPress={() => deletarJogador(item.id)}
                >
                  <Text style={styles.textBotao}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {

    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    padding: 8,
    marginBottom: 12,
    borderRadius: 6,
  },
  jogador: {
    backgroundColor: '#eee',
    padding: 12,
    marginBottom: 12,
    borderRadius: 6,
    alignItems: 'center'
  },
  nome: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
  },
  imagem: {
    width: 120,
    height: 120,
    borderRadius: 6,
  },
  botoes: {
    flexDirection: 'row',
    marginTop: 8,
    justifyContent: 'space-between',
    width: '100%'
  },
  botao: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  textBotao: {
    color: 'white',
    fontWeight: 'bold',
  },
});
