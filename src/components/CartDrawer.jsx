import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import OrderItem from '@/pages/OrderItem';

import { Button, Link as ChakraLink } from '@chakra-ui/react';
import {
    DrawerBackdrop,
    DrawerBody,
    DrawerCloseTrigger,
    DrawerContent, DrawerFooter,
    DrawerRoot,
    DrawerTrigger
} from "@/components/ui/drawer";

function CartDrawer() {
    const [open, setOpen] = useState(false);

    return (
        <DrawerRoot size="md" open={open} onOpenChange={(e) => setOpen(e.open)}>
            <DrawerBackdrop />
            <DrawerTrigger asChild>
                <ChakraLink asChild _focus={{ outline: "none" }} fontSize="sm" margin="3">
                    <Button variant="link" fontSize="sm" margin="3" padding="0">
                        장바구니
                    </Button>
                </ChakraLink>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerBody>
                    <OrderItem />
                </DrawerBody>
                <DrawerCloseTrigger />
                <DrawerFooter>
                    <ChakraLink
                        asChild
                        _focus={{ outline: "none" }}
                        fontSize="sm"
                        margin="3"
                        color="teal.600"
                        fontWeight="bold"
                    >
                        <Link to="/order-item">장바구니 이동</Link>
                    </ChakraLink>
                </DrawerFooter>
            </DrawerContent>
        </DrawerRoot>
    );
};

export default CartDrawer;
