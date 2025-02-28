import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useSearchStore from '@/store/SearchStore';

import { Input, IconButton } from '@chakra-ui/react';
import { InputGroup } from "@/components/ui/input-group"
import { LuSearch } from 'react-icons/lu';


function Search() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const { setSearch: setGlobalSearch } = useSearchStore();



    const handleChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearch = (e) => {
        if (e.key === "Enter" && e.nativeEvent.isComposing === false) {
            setGlobalSearch(searchTerm);
            navigate(`/products?search=${searchTerm}`);
            setSearchTerm("");
        }
    };

    return (
        <InputGroup
            flex="1"
            maxWidth="300px"
            w="100%"
            endElement={<LuSearch />}
        >
            <Input
                placeholder="Search"
                value={searchTerm}
                onChange={handleChange}
                onKeyDown={handleSearch}
            />
        </InputGroup>
    );
};

export default Search;