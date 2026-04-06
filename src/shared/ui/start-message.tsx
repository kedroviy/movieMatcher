import { FC } from "react"
import { Text } from "react-native"

export const StartMessage: FC = () => {
    return (
        <>
            <Text>
                <Text style={{
                    color: '#DC2626',
                    textAlign: 'center',
                    fontFamily: 'Roboto',
                    fontSize: 32,
                    fontWeight: '700',
                    lineHeight: 38.4,
                    letterSpacing: 5,
                }}
                >
                    M
                </Text>
                <Text style={{
                    color: '#FAFAFA',
                    textAlign: 'center',
                    fontFamily: 'Roboto',
                    fontSize: 32,
                    fontWeight: '700',
                    lineHeight: 38.4,
                    letterSpacing: 5,
                }}>OVIE</Text>
                <Text style={{
                    color: '#DC2626',
                    textAlign: 'center',
                    fontFamily: 'Roboto',
                    fontSize: 32,
                    fontWeight: '700',
                    lineHeight: 38.4,
                    letterSpacing: 5,
                }}>M</Text>
                <Text style={{
                    color: '#FAFAFA',
                    textAlign: 'center',
                    fontFamily: 'Roboto',
                    fontSize: 32,
                    fontWeight: '700',
                    lineHeight: 38.4,
                    letterSpacing: 5,
                }}>ATCH</Text>
            </Text>
        </>
    )
}