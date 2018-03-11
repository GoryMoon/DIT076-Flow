/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fgm.flow.dao;

import com.fgm.flow.core.User;
import com.fgm.flow.core.Post;
import com.fgm.flow.core.HiddenPost;
import com.fgm.flow.core.UserGroup;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import org.junit.AfterClass;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.assertFalse;
import org.junit.BeforeClass;
import org.junit.Test;


/**
 *
 * A starting point for more extensive testing of HiddenPostRegistry
 * 
 * Disabled as they won't pass if the db isn't initiated.
 * 
 * @author fgm
 */
public class HiddenPostRegistryTest
{
    public static final boolean DISABLED = true;
    
    static HiddenPostRegistry hidePostReg;
    static UserRegistry userReg;
    static PostRegistry postReg;
    static UserGroupRegistry uGroupReg;
    static EntityManager em;
  
    @BeforeClass
    public static void setUpClass()
    {
        EntityManagerFactory emf = Persistence.createEntityManagerFactory("flow_pu_test");
        em = emf.createEntityManager();
        hidePostReg= new HiddenPostRegistry();
        userReg = new UserRegistry();
        postReg = new PostRegistry();
        uGroupReg = new UserGroupRegistry();
        hidePostReg.setEntityManager(em);
        userReg.setEntityManager(em);
        postReg.setEntityManager(em);
        uGroupReg.setEntityManager(em);
        
    }
    
    @AfterClass
    public static void tearDownClass()
    {
        em.close();
    }

    @Test
    public void testCreateHiddenRelationBetweenUserNPostCheckIfUserInRelation()
            throws Exception
    {
        if(DISABLED) return;
        
        em.getTransaction().begin();
        
        User testUser = new User("¤testEmail@test", "¤testNick", "¤testPass");
        userReg.create(testUser);
  
        User wrongUser = new User("¤wrong@wrong", "¤wrongNick", "¤wrongPass");
        userReg.create(wrongUser);
        
        UserGroup testGroup = new UserGroup("¤testGroup");
        uGroupReg.create(testGroup);
        
        Post testPost = new Post("¤testTitle", "¤testText", testGroup, testUser);
        postReg.create(testPost);
        
        HiddenPost testHide = new HiddenPost(testUser, testPost);
        hidePostReg.create(testHide);
        
        assertTrue(
                hidePostReg.find(testHide.getId()).getUser().equals(testUser)
        );
        em.getTransaction().rollback();
    }
    
    @Test
    public void testCreateHiddenRelationBetweenUserNPostCheckThatWrongUserNotInRelation()
            throws Exception
    {
        if(DISABLED) return;
        
        em.getTransaction().begin();
        
        User testUser = new User("¤testEmail@test", "¤testNick", "¤testPass");
        userReg.create(testUser);

        User wrongUser = new User("¤wrong@wrong", "¤wrongNick", "¤wrongPass");
        userReg.create(wrongUser);
        
        UserGroup testGroup = new UserGroup("¤testGroup");
        uGroupReg.create(testGroup);
        
        Post testPost = new Post("¤testTitle", "¤testText", testGroup, testUser);
        postReg.create(testPost);
        
        HiddenPost testHide = new HiddenPost(testUser, testPost);
        hidePostReg.create(testHide);
        
        assertFalse(
                hidePostReg.find(testHide.getId()).getUser().equals(wrongUser)
        );
        em.getTransaction().rollback();
    }
    
}
