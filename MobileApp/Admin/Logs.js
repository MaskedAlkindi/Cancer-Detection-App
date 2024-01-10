import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput } from 'react-native';
import { AuthContext } from '../AuthContext';
import { handleGetLogs } from '../services/handlegetlogs';
import LoadingModal from '../components/LoadingModal';

const LogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Add isLoading state
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setIsLoading(true); // Show loading modal
        const logsData = await handleGetLogs(user.token);
        setLogs(logsData);
        setFilteredLogs(logsData); // Initially display all logs
      } catch (error) {
        console.error('Failed to fetch logs:', error);
      } finally {
        setIsLoading(false); // Hide loading modal
      }
    };

    fetchLogs();
  }, [user.token]);

  useEffect(() => {
    const result = logs.filter(log => 
      log.user_id.toString().includes(searchQuery)
    );
    setFilteredLogs(result);
  }, [searchQuery, logs]);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.text}>User ID: {item.user_id}</Text>
      <Text style={styles.text}>Action: {item.action}</Text>
      <Text style={styles.text}>Timestamp: {item.timestamp}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={{ marginBottom: 40 }}></View>
      <TextInput
        style={styles.searchBar}
        onChangeText={setSearchQuery}
        value={searchQuery}
        placeholder="Search by User ID"
      />
      {isLoading ? ( // Show loading modal if isLoading is true
        <LoadingModal />
      ) : (
        <FlatList
          data={filteredLogs}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
  item: {
    backgroundColor: '#fff',
    marginVertical: 10,
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  searchBar: {
    height: 40,
    marginHorizontal: 12,
    marginBottom: 20,
    marginTop: 10, // Add marginTop to move the search bar lower
    backgroundColor: '#fff', // Add backgroundColor to give it a white background
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
  },
});

export default LogsPage;
