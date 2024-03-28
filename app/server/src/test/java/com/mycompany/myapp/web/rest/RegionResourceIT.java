package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.RegionAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Region;
import com.mycompany.myapp.repository.RegionRepository;
import com.mycompany.myapp.service.dto.RegionDTO;
import com.mycompany.myapp.service.mapper.RegionMapper;
import jakarta.persistence.EntityManager;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link RegionResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class RegionResourceIT {

    private static final String DEFAULT_REGION_NAME = "AAAAAAAAAA";
    private static final String UPDATED_REGION_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/regions";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private ObjectMapper om;

    @Autowired
    private RegionRepository regionRepository;

    @Autowired
    private RegionMapper regionMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restRegionMockMvc;

    private Region region;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Region createEntity(EntityManager em) {
        Region region = new Region().regionName(DEFAULT_REGION_NAME);
        return region;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Region createUpdatedEntity(EntityManager em) {
        Region region = new Region().regionName(UPDATED_REGION_NAME);
        return region;
    }

    @BeforeEach
    public void initTest() {
        region = createEntity(em);
    }

    @Test
    @Transactional
    void createRegion() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Region
        RegionDTO regionDTO = regionMapper.toDto(region);
        var returnedRegionDTO = om.readValue(
            restRegionMockMvc
                .perform(post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(regionDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            RegionDTO.class
        );

        // Validate the Region in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedRegion = regionMapper.toEntity(returnedRegionDTO);
        assertRegionUpdatableFieldsEquals(returnedRegion, getPersistedRegion(returnedRegion));
    }

    @Test
    @Transactional
    void createRegionWithExistingId() throws Exception {
        // Create the Region with an existing ID
        regionRepository.saveAndFlush(region);
        RegionDTO regionDTO = regionMapper.toDto(region);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restRegionMockMvc
            .perform(post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(regionDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Region in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllRegions() throws Exception {
        // Initialize the database
        regionRepository.saveAndFlush(region);

        // Get all the regionList
        restRegionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(region.getId().toString())))
            .andExpect(jsonPath("$.[*].regionName").value(hasItem(DEFAULT_REGION_NAME)));
    }

    @Test
    @Transactional
    void getRegion() throws Exception {
        // Initialize the database
        regionRepository.saveAndFlush(region);

        // Get the region
        restRegionMockMvc
            .perform(get(ENTITY_API_URL_ID, region.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(region.getId().toString()))
            .andExpect(jsonPath("$.regionName").value(DEFAULT_REGION_NAME));
    }

    @Test
    @Transactional
    void getNonExistingRegion() throws Exception {
        // Get the region
        restRegionMockMvc.perform(get(ENTITY_API_URL_ID, UUID.randomUUID().toString())).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingRegion() throws Exception {
        // Initialize the database
        regionRepository.saveAndFlush(region);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the region
        Region updatedRegion = regionRepository.findById(region.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedRegion are not directly saved in db
        em.detach(updatedRegion);
        updatedRegion.regionName(UPDATED_REGION_NAME);
        RegionDTO regionDTO = regionMapper.toDto(updatedRegion);

        restRegionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, regionDTO.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(regionDTO))
            )
            .andExpect(status().isOk());

        // Validate the Region in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedRegionToMatchAllProperties(updatedRegion);
    }

    @Test
    @Transactional
    void putNonExistingRegion() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        region.setId(UUID.randomUUID());

        // Create the Region
        RegionDTO regionDTO = regionMapper.toDto(region);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRegionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, regionDTO.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(regionDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Region in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchRegion() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        region.setId(UUID.randomUUID());

        // Create the Region
        RegionDTO regionDTO = regionMapper.toDto(region);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRegionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(regionDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Region in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamRegion() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        region.setId(UUID.randomUUID());

        // Create the Region
        RegionDTO regionDTO = regionMapper.toDto(region);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRegionMockMvc
            .perform(put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(regionDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Region in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateRegionWithPatch() throws Exception {
        // Initialize the database
        regionRepository.saveAndFlush(region);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the region using partial update
        Region partialUpdatedRegion = new Region();
        partialUpdatedRegion.setId(region.getId());

        restRegionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRegion.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedRegion))
            )
            .andExpect(status().isOk());

        // Validate the Region in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertRegionUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedRegion, region), getPersistedRegion(region));
    }

    @Test
    @Transactional
    void fullUpdateRegionWithPatch() throws Exception {
        // Initialize the database
        regionRepository.saveAndFlush(region);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the region using partial update
        Region partialUpdatedRegion = new Region();
        partialUpdatedRegion.setId(region.getId());

        partialUpdatedRegion.regionName(UPDATED_REGION_NAME);

        restRegionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRegion.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedRegion))
            )
            .andExpect(status().isOk());

        // Validate the Region in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertRegionUpdatableFieldsEquals(partialUpdatedRegion, getPersistedRegion(partialUpdatedRegion));
    }

    @Test
    @Transactional
    void patchNonExistingRegion() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        region.setId(UUID.randomUUID());

        // Create the Region
        RegionDTO regionDTO = regionMapper.toDto(region);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRegionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, regionDTO.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(regionDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Region in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchRegion() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        region.setId(UUID.randomUUID());

        // Create the Region
        RegionDTO regionDTO = regionMapper.toDto(region);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRegionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(regionDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Region in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamRegion() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        region.setId(UUID.randomUUID());

        // Create the Region
        RegionDTO regionDTO = regionMapper.toDto(region);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRegionMockMvc
            .perform(
                patch(ENTITY_API_URL).with(csrf()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(regionDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Region in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteRegion() throws Exception {
        // Initialize the database
        regionRepository.saveAndFlush(region);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the region
        restRegionMockMvc
            .perform(delete(ENTITY_API_URL_ID, region.getId().toString()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return regionRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected Region getPersistedRegion(Region region) {
        return regionRepository.findById(region.getId()).orElseThrow();
    }

    protected void assertPersistedRegionToMatchAllProperties(Region expectedRegion) {
        assertRegionAllPropertiesEquals(expectedRegion, getPersistedRegion(expectedRegion));
    }

    protected void assertPersistedRegionToMatchUpdatableProperties(Region expectedRegion) {
        assertRegionAllUpdatablePropertiesEquals(expectedRegion, getPersistedRegion(expectedRegion));
    }
}
