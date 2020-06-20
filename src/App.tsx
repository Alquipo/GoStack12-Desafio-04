import React, { useEffect, useState } from "react";
import api from "./services/api";
import { Button } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";

interface Repository {
  id: string;
  title: string;
  url: string;
  techs: string[];
  likes: number;
}

export default function App() {
  const [repositories, setRepositories] = useState<Repository[]>([]);

  useEffect(() => {
    api.get("repositories").then((response) => {
      setRepositories(response.data);
    });
  }, []);

  async function handleAddRepository() {
    const response = await api.post("repositories", {
      title: `Novo Repositório ${Date.now()}`,
      url: "https://github.com/Alquipo/GoStack12-desafio-03",
      techs: ["Node JS", "React JS", "React Native"],
    });

    const repository = response.data;

    //atualiza o estado da aplicação
    setRepositories([...repositories, repository]);
  }

  async function handleRemoveRepository(id: string) {
    await api.delete(`repositories/${id}`);

    const updatedRepositories = repositories.filter(
      (repository) => repository.id !== id
    );

    setRepositories(updatedRepositories);
  }

  async function handleLikeRepository(id: string) {
    const response = await api.post(`repositories/${id}/like`);
    const repositoryLike = response.data;

    const repositoriesUpdate = repositories.map((repository) => {
      if (repository.id === id) {
        return repositoryLike;
      } else {
        return repository;
      }
    });

    setRepositories(repositoriesUpdate);
  }

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="hsla(220, 13%, 95%, 0.932)"
      />

      <SafeAreaView style={styles.container}>
        <FlatList
          data={repositories}
          keyExtractor={(repository) => repository.id}
          renderItem={({ item: repository }) => (
            <View style={styles.repositoryContainer}>
              <Text style={styles.repository}>{repository.title}</Text>

              <View style={styles.techsContainer}>
                {repository.techs.map((tech) => {
                  return (
                    <Text key={tech} style={styles.tech}>
                      {tech}
                    </Text>
                  );
                })}
              </View>

              <View></View>

              <View style={styles.likesContainer}>
                {repository.likes === 0 ? (
                  <>
                    <Text
                      style={styles.likeText}
                      testID={`repository-likes-${repository.id}`}
                    >
                      Seu repositório não teve nenhuma curtida 😊
                    </Text>

                    <Button
                      icon={<Icon name="github" size={30} />}
                      title="  GitHub"
                      onPress={() => Linking.openURL(repository.url)}
                      raised
                      buttonStyle={{ backgroundColor: "#f5f5f5" }}
                      titleStyle={{ color: "black", fontSize: 25 }}
                    />
                  </>
                ) : (
                  <>
                    <Text
                      style={styles.likeText}
                      testID={`repository-likes-${repository.id}`}
                    >
                      {repository.likes} 👍
                    </Text>
                    <Button
                      icon={<Icon name="github" size={30} />}
                      title="  GitHub"
                      onPress={() => Linking.openURL(repository.url)}
                      raised
                      buttonStyle={{ backgroundColor: "#f5f5f5" }}
                      titleStyle={{ color: "black", fontSize: 25 }}
                    />
                  </>
                )}
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.button}
                  onPress={() => handleLikeRepository(repository.id)}
                  testID={`like-button-${repository.id}`}
                >
                  <Text style={[styles.buttonText, styles.buttonColorLike]}>
                    Curtir
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.button}
                  onPress={() => handleRemoveRepository(repository.id)}
                  testID={`remove-button-${repository.id}`}
                >
                  <Text style={[styles.buttonText, styles.buttonColorRemove]}>
                    Remover
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.buttonAdd}
          onPress={handleAddRepository}
        >
          <Text style={[styles.buttonTextAdd, styles.buttonColorAdd]}>
            Adicionar
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "hsla(220, 13%, 95%, 0.932)",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
    marginTop: 10,
    borderRadius: 15,
    elevation: 10,
  },
  repository: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
    textAlign: "center",
    justifyContent: "center",
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#28a745",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
    borderRadius: 25,
  },
  likesContainer: {
    marginTop: 15,
    justifyContent: "space-between",
    flexDirection: "column",
  },
  likeText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  buttonContainer: {
    marginLeft: 6,
    flexDirection: "row",
  },
  button: {
    marginTop: 10,
    flex: 1,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    padding: 15,
    borderRadius: 10,
    textAlign: "center",
  },
  buttonColorLike: {
    backgroundColor: "#17a2b8",
  },
  buttonColorRemove: {
    backgroundColor: "#dc3545",
  },
  buttonColorAdd: {
    backgroundColor: "#007bff",
  },

  buttonAdd: {
    padding: 5,
  },

  buttonTextAdd: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    padding: 15,
    borderRadius: 10,
    textAlign: "center",
    backgroundColor: "transparent",
  },
});
