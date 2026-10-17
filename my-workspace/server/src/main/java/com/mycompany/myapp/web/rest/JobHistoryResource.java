package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.repository.JobHistoryRepository;
import com.mycompany.myapp.service.JobHistoryService;
import com.mycompany.myapp.service.dto.JobHistoryDTO;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.JobHistory}.
 */
@RestController
@RequestMapping("/api/job-histories")
public class JobHistoryResource {

    private static final Logger LOG = LoggerFactory.getLogger(JobHistoryResource.class);

    private static final String ENTITY_NAME = "jobHistory";

    @Value("${jhipster.clientApp.name:jhipster}")
    private String applicationName;

    private final JobHistoryService jobHistoryService;

    private final JobHistoryRepository jobHistoryRepository;

    private final ObjectMapper om;

    private final EntityManager em;

    public JobHistoryResource(
        JobHistoryService jobHistoryService,
        JobHistoryRepository jobHistoryRepository,
        ObjectMapper om,
        EntityManager em
    ) {
        this.jobHistoryService = jobHistoryService;
        this.jobHistoryRepository = jobHistoryRepository;
        this.om = om;
        this.em = em;
    }

    /**
     * {@code POST  /job-histories} : Create a new jobHistory.
     *
     * @param jobHistoryDTO the jobHistoryDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new jobHistoryDTO, or with status {@code 400 (Bad Request)} if the jobHistory already has an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<JobHistoryDTO> createJobHistory(@RequestBody JobHistoryDTO jobHistoryDTO) throws URISyntaxException {
        LOG.debug("REST request to save JobHistory : {}", jobHistoryDTO);
        if (jobHistoryDTO.getId() != null) {
            throw BadRequestAlertException.idexists(ENTITY_NAME);
        }
        jobHistoryDTO = jobHistoryService.save(jobHistoryDTO);
        return ResponseEntity.created(new URI("/api/job-histories/" + jobHistoryDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, jobHistoryDTO.getId().toString()))
            .body(jobHistoryDTO);
    }

    /**
     * {@code PUT  /job-histories/:id} : Updates an existing jobHistory.
     *
     * @param id the id of the jobHistoryDTO to save.
     * @param jobHistoryDTO the jobHistoryDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated jobHistoryDTO,
     * or with status {@code 400 (Bad Request)} if the jobHistoryDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the jobHistoryDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<JobHistoryDTO> updateJobHistory(
        @PathVariable(value = "id", required = false) final UUID id,
        @RequestBody JobHistoryDTO jobHistoryDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update JobHistory : {}, {}", id, jobHistoryDTO);
        if (jobHistoryDTO.getId() == null) {
            throw BadRequestAlertException.idnull(ENTITY_NAME);
        }
        if (!Objects.equals(id, jobHistoryDTO.getId())) {
            throw BadRequestAlertException.idinvalid(ENTITY_NAME);
        }

        if (!jobHistoryRepository.existsById(id)) {
            throw BadRequestAlertException.idnotfound(ENTITY_NAME);
        }

        jobHistoryDTO = jobHistoryService.update(jobHistoryDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, jobHistoryDTO.getId().toString()))
            .body(jobHistoryDTO);
    }

    /**
     * {@code PATCH  /job-histories/:id} : Partial updates given fields of an existing jobHistory, field will ignore if it is null
     *
     * @param id the id of the jobHistoryDTO to save.
     * @param jobHistoryDTO the jobHistoryDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated jobHistoryDTO,
     * or with status {@code 400 (Bad Request)} if the jobHistoryDTO is not valid,
     * or with status {@code 404 (Not Found)} if the jobHistoryDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the jobHistoryDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<JobHistoryDTO> partialUpdateJobHistory(
        @PathVariable(value = "id", required = false) final UUID id,
        @io.swagger.v3.oas.annotations.parameters.RequestBody(
            content = @io.swagger.v3.oas.annotations.media.Content(
                schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = JobHistoryDTO.class)
            )
        ) @RequestBody ObjectNode jobHistoryDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partially update JobHistory : {}, {}", id, jobHistoryDTO);
        var idNode = jobHistoryDTO.remove("id");
        if (idNode == null || idNode.isNull()) {
            throw BadRequestAlertException.idnull(ENTITY_NAME);
        }
        if (!idNode.isString()) {
            throw BadRequestAlertException.idinvalid(ENTITY_NAME);
        }
        if (!Objects.equals(id.toString(), idNode.stringValue())) {
            throw BadRequestAlertException.idinvalid(ENTITY_NAME);
        }

        return jobHistoryService
            .findOne(id)
            .map(existingJobHistory -> {
                try {
                    em.clear();
                    existingJobHistory = this.om.readerForUpdating(existingJobHistory).readValue(jobHistoryDTO);
                    return existingJobHistory;
                } catch (JacksonException e) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid jobHistory", e);
                }
            })
            .map(jobHistoryService::update)
            .map(res ->
                ResponseEntity.ok()
                    .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, res.getId().toString()))
                    .body(res)
            )
            .orElseThrow(() -> BadRequestAlertException.idnotfound(ENTITY_NAME));
    }

    /**
     * {@code GET  /job-histories} : get all the Job Histories.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of Job Histories in body.
     */
    @GetMapping("")
    public ResponseEntity<List<JobHistoryDTO>> getAllJobHistories(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get a page of JobHistories");
        Page<JobHistoryDTO> page = jobHistoryService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /job-histories/:id} : get the "id" jobHistory.
     *
     * @param id the id of the jobHistoryDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the jobHistoryDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<JobHistoryDTO> getJobHistory(@PathVariable("id") UUID id) {
        LOG.debug("REST request to get JobHistory : {}", id);
        Optional<JobHistoryDTO> jobHistoryDTO = jobHistoryService.findOne(id);
        return ResponseUtil.wrapOrNotFound(jobHistoryDTO);
    }

    /**
     * {@code DELETE  /job-histories/:id} : delete the "id" jobHistory.
     *
     * @param id the id of the jobHistoryDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJobHistory(@PathVariable("id") UUID id) {
        LOG.debug("REST request to delete JobHistory : {}", id);
        jobHistoryService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
