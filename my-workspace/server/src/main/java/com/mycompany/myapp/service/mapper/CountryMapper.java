package com.mycompany.myapp.service.mapper;

import com.mycompany.myapp.domain.Country;
import com.mycompany.myapp.domain.Region;
import com.mycompany.myapp.service.dto.CountryDTO;
import com.mycompany.myapp.service.dto.RegionDTO;
import java.util.Objects;
import java.util.UUID;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Country} and its DTO {@link CountryDTO}.
 */
@Mapper(componentModel = "spring")
public interface CountryMapper extends EntityMapper<CountryDTO, Country> {
    @Mapping(target = "region", source = "region", qualifiedByName = "regionId")
    CountryDTO toDto(Country s);

    @Named("regionId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    RegionDTO toDtoRegionId(Region region);

    default String map(UUID value) {
        return Objects.toString(value, null);
    }
}
