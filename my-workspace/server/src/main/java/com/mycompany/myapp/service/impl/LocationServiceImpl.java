package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.Location;
import com.mycompany.myapp.repository.LocationRepository;
import com.mycompany.myapp.service.LocationService;
import com.mycompany.myapp.service.dto.LocationDTO;
import com.mycompany.myapp.service.mapper.LocationMapper;
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
 * Service Implementation for managing {@link com.mycompany.myapp.domain.Location}.
 */
@Service
@Transactional
public class LocationServiceImpl implements LocationService {

    private static final Logger LOG = LoggerFactory.getLogger(LocationServiceImpl.class);

    private final LocationRepository locationRepository;

    private final LocationMapper locationMapper;

    public LocationServiceImpl(LocationRepository locationRepository, LocationMapper locationMapper) {
        this.locationRepository = locationRepository;
        this.locationMapper = locationMapper;
    }

    @Override
    public LocationDTO save(LocationDTO locationDTO) {
        LOG.debug("Request to save Location : {}", locationDTO);
        Location location = locationMapper.toEntity(locationDTO);
        location = locationRepository.save(location);
        return locationMapper.toDto(location);
    }

    @Override
    public LocationDTO update(LocationDTO locationDTO) {
        LOG.debug("Request to update Location : {}", locationDTO);
        Location location = locationMapper.toEntity(locationDTO);
        location = locationRepository.save(location);
        return locationMapper.toDto(location);
    }

    @Override
    public Optional<LocationDTO> partialUpdate(LocationDTO locationDTO) {
        LOG.debug("Request to partially update Location : {}", locationDTO);

        return locationRepository
            .findById(locationDTO.getId())
            .map(existingLocation -> {
                locationMapper.partialUpdate(existingLocation, locationDTO);

                return existingLocation;
            })
            .map(locationRepository::save)
            .map(locationMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<LocationDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all Locations");
        return locationRepository.findAll(pageable).map(locationMapper::toDto);
    }

    /**
     *  Get all the locations where Department is {@code null}.
     *  @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<LocationDTO> findAllWhereDepartmentIsNull() {
        LOG.debug("Request to get all locations where Department is null");
        return StreamSupport.stream(locationRepository.findAll().spliterator(), false)
            .filter(location -> location.getDepartment() == null)
            .map(locationMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<LocationDTO> findOne(UUID id) {
        LOG.debug("Request to get Location : {}", id);
        return locationRepository.findById(id).map(locationMapper::toDto);
    }

    @Override
    public void delete(UUID id) {
        LOG.debug("Request to delete Location : {}", id);
        locationRepository.deleteById(id);
    }
}
