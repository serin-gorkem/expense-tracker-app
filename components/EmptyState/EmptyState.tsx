import { StyleSheet, Text, View } from "react-native";

type EmptyStateProps = {
    title: string,
    description: string,
}

export default function EmptyState({title, description} : EmptyStateProps){
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 8,
        color: 'rgba(255,255,255,0.9)',
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        color: 'rgba(255,255,255,0.6)',
    },
})