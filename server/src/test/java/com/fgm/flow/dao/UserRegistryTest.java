/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fgm.flow.dao;

import com.fgm.flow.core.User;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import org.junit.AfterClass;
import static org.junit.Assert.assertTrue;
import org.junit.BeforeClass;
import org.junit.Test;


/**
 *
 * A starting point for more extensive testing of UserRegistry
 * 
 * Disabled as they won't pass if the db isn't initiated.
 * 
 * @author fgm
 */
public class UserRegistryTest
{
    public static final boolean DISABLED = true;

    static UserRegistry userReg;
    static EntityManager em;
  
    @BeforeClass
    public static void setUpClass()
    {
        EntityManagerFactory emf = Persistence.createEntityManagerFactory("flow_pu_test");
        em = emf.createEntityManager();
        userReg = new UserRegistry();
        userReg.setEntityManager(em);
    }
    
    @AfterClass
    public static void tearDownClass()
    {
        em.close();
    }

    @Test
    public void testCreateAndFind() throws Exception
    {
        if(DISABLED) return;
        
        em.getTransaction().begin();
        
        User testUser = new User("¤testEmail@test", "¤testNick", "¤testPass");
        userReg.create(testUser);
  
        
        assertTrue(userReg.find(testUser.getId()).equals(testUser));
        em.getTransaction().rollback();
    }
    
}
