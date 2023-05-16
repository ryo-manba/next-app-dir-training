import { Container } from "./common/components";
import { ReactNode } from "react"

export default function Main({ children }: { children: ReactNode } ) {
    return (
        <Container
            as="main"
            maxW="container.lg"
            my="4"
            minH="calc(100vh - 115px - 2rem)"
        >
            {children}
        </Container>
    )
}