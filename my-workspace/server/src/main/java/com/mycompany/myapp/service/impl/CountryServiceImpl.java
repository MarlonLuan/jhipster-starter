package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.Country;
import com.mycompany.myapp.repository.CountryRepository;
import com.mycompany.myapp.service.CountryService;
import com.mycompany.myapp.service.dto.CountryDTO;
import com.mycompany.myapp.service.mapper.CountryMapper;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.mycompany.myapp.domain.Country}.
 */
@Service
@Transactional
public class CountryServiceImpl implements CountryService {

    private static final Logger log = LoggerFactory.getLogger(CountryServiceImpl.class);

    private final CountryRepository countryRepository;

    private final CountryMapper countryMapper;

    public CountryServiceImpl(CountryRepository countryRepository, CountryMapper countryMapper) {
        this.countryRepository = countryRepository;
        this.countryMapper = countryMapper;
    }

    @Override
    public CountryDTO save(CountryDTO countryDTO) {
        log.debug("Request to save Country : {}", countryDTO);
        Country country = countryMapper.toEntity(countryDTO);
        country = countryRepository.save(country);
        return countryMapper.toDto(country);
    }

    @Override
    public CountryDTO update(CountryDTO countryDTO) {
        log.debug("Request to update Country : {}", countryDTO);
        Country country = countryMapper.toEntity(countryDTO);
        country = countryRepository.save(country);
        return countryMapper.toDto(country);
    }

    @Override
    public Optional<CountryDTO> partialUpdate(CountryDTO countryDTO) {
        log.debug("Request to partially update Country : {}", countryDTO);

        return countryRepository
            .findById(countryDTO.getId())
            .map(existingCountry -> {
                countryMapper.partialUpdate(existingCountry, countryDTO);

                return existingCountry;
            })
            .map(countryRepository::save)
            .map(countryMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CountryDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Countries");
        return countryRepository.findAll(pageable).map(countryMapper::toDto);
    }

    /**
     *  Get all the countries where Location is {@code null}.
     *  @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<CountryDTO> findAllWhereLocationIsNull() {
        log.debug("Request to get all countries where Location is null");
        return StreamSupport.stream(countryRepository.findAll().spliterator(), false)
            .filter(country -> country.getLocation() == null)
            .map(countryMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<CountryDTO> findOne(UUID id) {
        log.debug("Request to get Country : {}", id);
        return countryRepository.findById(id).map(countryMapper::toDto);
    }

    @Override
    public void delete(UUID id) {
        log.debug("Request to delete Country : {}", id);
        countryRepository.deleteById(id);
    }
}
