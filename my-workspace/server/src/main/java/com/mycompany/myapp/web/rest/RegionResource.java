package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.repository.RegionRepository;
import com.mycompany.myapp.service.RegionService;
import com.mycompany.myapp.service.dto.RegionDTO;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import jakarta.persistence.EntityManager;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.node.ObjectNode;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Region}.
 */
@RestController
@RequestMapping("/api/regions")
public class RegionResource {

    private static final Logger LOG = LoggerFactory.getLogger(RegionResource.class);

    private static final String ENTITY_NAME = "region";

    @Value("${jhipster.clientApp.name:jhipster}")
    private String applicationName;

    private final RegionService regionService;

    private final RegionRepository regionRepository;

    private final ObjectMapper om;

    private final EntityManager em;

    public RegionResource(RegionService regionService, RegionRepository regionRepository, ObjectMapper om, EntityManager em) {
        this.regionService = regionService;
        this.regionRepository = regionRepository;
        this.om = om;
        this.em = em;
    }

    /**
     * {@code POST  /regions} : Create a new region.
     *
     * @param regionDTO the regionDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new regionDTO, or with status {@code 400 (Bad Request)} if the region already has an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<RegionDTO> createRegion(@RequestBody RegionDTO regionDTO) throws URISyntaxException {
        LOG.debug("REST request to save Region : {}", regionDTO);
        if (regionDTO.getId() != null) {
            throw BadRequestAlertException.idexists(ENTITY_NAME);
        }
        regionDTO = regionService.save(regionDTO);
        return ResponseEntity.created(new URI("/api/regions/" + regionDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, regionDTO.getId().toString()))
            .body(regionDTO);
    }

    /**
     * {@code PUT  /regions/:id} : Updates an existing region.
     *
     * @param id the id of the regionDTO to save.
     * @param regionDTO the regionDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated regionDTO,
     * or with status {@code 400 (Bad Request)} if the regionDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the regionDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<RegionDTO> updateRegion(
        @PathVariable(value = "id", required = false) final UUID id,
        @RequestBody RegionDTO regionDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update Region : {}, {}", id, regionDTO);
        if (regionDTO.getId() == null) {
            throw BadRequestAlertException.idnull(ENTITY_NAME);
        }
        if (!Objects.equals(id, regionDTO.getId())) {
            throw BadRequestAlertException.idinvalid(ENTITY_NAME);
        }

        if (!regionRepository.existsById(id)) {
            throw BadRequestAlertException.idnotfound(ENTITY_NAME);
        }

        regionDTO = regionService.update(regionDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, regionDTO.getId().toString()))
            .body(regionDTO);
    }

    /**
     * {@code PATCH  /regions/:id} : Partial updates given fields of an existing region, field will ignore if it is null
     *
     * @param id the id of the regionDTO to save.
     * @param regionDTO the regionDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated regionDTO,
     * or with status {@code 400 (Bad Request)} if the regionDTO is not valid,
     * or with status {@code 404 (Not Found)} if the regionDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the regionDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<RegionDTO> partialUpdateRegion(
        @PathVariable(value = "id", required = false) final UUID id,
        @io.swagger.v3.oas.annotations.parameters.RequestBody(
            content = @io.swagger.v3.oas.annotations.media.Content(
                schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = RegionDTO.class)
            )
        ) @RequestBody ObjectNode regionDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partially update Region : {}, {}", id, regionDTO);
        var idNode = regionDTO.remove("id");
        if (idNode == null || idNode.isNull()) {
            throw BadRequestAlertException.idnull(ENTITY_NAME);
        }
        if (!idNode.isString()) {
            throw BadRequestAlertException.idinvalid(ENTITY_NAME);
        }
        if (!Objects.equals(id.toString(), idNode.stringValue())) {
            throw BadRequestAlertException.idinvalid(ENTITY_NAME);
        }

        return regionService
            .findOne(id)
            .map(existingRegion -> {
                try {
                    em.clear();
                    existingRegion = this.om.readerForUpdating(existingRegion).readValue(regionDTO);
                    return existingRegion;
                } catch (JacksonException e) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid region", e);
                }
            })
            .map(regionService::update)
            .map(res ->
                ResponseEntity.ok()
                    .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, res.getId().toString()))
                    .body(res)
            )
            .orElseThrow(() -> BadRequestAlertException.idnotfound(ENTITY_NAME));
    }

    /**
     * {@code GET  /regions} : get all the Regions.
     *
     * @param pageable the pagination information.
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of Regions in body.
     */
    @GetMapping("")
    public ResponseEntity<List<RegionDTO>> getAllRegions(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable,
        @RequestParam(name = "filter", required = false) String filter
    ) {
        if ("country-is-null".equals(filter)) {
            LOG.debug("REST request to get all Regions where country is null");
            return new ResponseEntity<>(regionService.findAllWhereCountryIsNull(), HttpStatus.OK);
        }
        LOG.debug("REST request to get a page of Regions");
        Page<RegionDTO> page = regionService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /regions/:id} : get the "id" region.
     *
     * @param id the id of the regionDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the regionDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<RegionDTO> getRegion(@PathVariable("id") UUID id) {
        LOG.debug("REST request to get Region : {}", id);
        Optional<RegionDTO> regionDTO = regionService.findOne(id);
        return ResponseUtil.wrapOrNotFound(regionDTO);
    }

    /**
     * {@code DELETE  /regions/:id} : delete the "id" region.
     *
     * @param id the id of the regionDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRegion(@PathVariable("id") UUID id) {
        LOG.debug("REST request to delete Region : {}", id);
        regionService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
