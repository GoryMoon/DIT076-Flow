/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fgm.flow.rest;

import com.fgm.flow.core.Post;
import com.fgm.flow.core.User;
import com.fgm.flow.core.UserGroup;
import com.fgm.flow.core.Membership;
import com.fgm.flow.core.HiddenPost;
import com.fgm.flow.core.HiddenPost.HiddenPostId;
import com.fgm.flow.dao.PostRegistry;
import com.fgm.flow.dao.UserRegistry;
import com.fgm.flow.dao.UserGroupRegistry;
import com.fgm.flow.dao.MembershipRegistry;
import com.fgm.flow.dao.HiddenPostRegistry;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import java.net.URI;
import java.util.Date;
import java.util.List;
import java.util.ArrayList;
import java.util.Date;
import static java.util.Collections.sort;
import java.util.Comparator;
import static java.lang.System.out;
import static java.lang.System.err;
import javax.ejb.EJB;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.UriInfo;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.FormParam;
import javax.ws.rs.Produces;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import static javax.ws.rs.core.Response.Status.*;

/**
 *
 * @author fgm
 */
@Path("post")
public class PostResource {

    //private static final Logger LOG = Logger.getLogger(UserResource.class.getName());

    @Context
    private UriInfo uriInfo;

    @EJB
    private PostRegistry postReg;
    @EJB
    private UserRegistry userReg;
    @EJB
    private UserGroupRegistry uGroupReg;
    @EJB
    private MembershipRegistry memshipReg;
    @EJB
    private HiddenPostRegistry hidePostReg;
    private final Gson gson = new Gson();
    
    GsonBuilder gb = new GsonBuilder();
    Gson gsonEWE = gb.excludeFieldsWithoutExposeAnnotation().create();
    
    static class GetData
    {
        public Integer userid;
        public Integer ownerid;
        public Integer groupid;
        public String nick;
        public Integer id;
        public String title;
        public String text;
        public Date before;
        public Date after;
        public Integer count;
    }
    
    static class GetDataOut
    {
        public Integer ownerid;
        public Integer groupid;
        public Integer id;
        public String nick;
        public String title;
        public String text;
        public Date time;
    
        public GetDataOut(Post post)
        {
            this.ownerid = post.getPoster().getId();
            this.groupid = post.getUserGroup().getId();
            this.id = post.getId();
            this.nick = post.getPoster().getNick();
            this.title = post.getTitle();
            this.text = post.getText();
            this.time = post.getTime();            
        }
    }

    // For retrieving posts
    @POST
    @Path("get")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Response getRequest(GetData inData)
    {
        // Most GetData fields are currentlty ignored 
        if(inData.userid == null)
        {
            return Response.status(BAD_REQUEST).build();
        }
        
        User user = userReg.find(inData.userid);
        
        // Return status 'not found' if user does not exist
        if(user == null)
        {
            return Response.status(NOT_FOUND).build();
        }
        
        //List<Post> posts = new ArrayList<>();
        List<GetDataOut> GetDataOutList = new ArrayList<>();
        
        // Get posts for all groups the user is an owner of active member of
        if(inData.groupid == null)
        {
            for(Membership memship : user.getMemberships())
            {
                if(memship.getStatus() == 0 || memship.getStatus() == 1)
                {
                    for(Post post : memship.getUserGroup().getPosts())
                    {
                        GetDataOutList.add(new GetDataOut(post));
                    }
                }
            }
        }
        else
        {           
            UserGroup userGroup = uGroupReg.find(inData.groupid);
            if(userGroup == null)
            {
                return Response.status(NOT_FOUND).build();
            }
            
            if(!user.isMemberOfGroup(userGroup))
            {
                return Response.status(UNAUTHORIZED).build();
            }
            for(Post post : userGroup.getPosts())
            {
                GetDataOutList.add(new GetDataOut(post));
            }
        }

        // Newest post first
        sort(GetDataOutList, new GDOComparator());

        return Response.ok(gson.toJson(GetDataOutList)).build();
    }
    
    static class PostData
    {
        public Integer userid;
        public Integer groupid;
        public String title;
        public String text;
    }
    
    static class PostDataOut
    {
        public Integer ownerid;
        public Integer groupid;
        public Integer id;
        public String nick;
        public String title;
        public String text;
        public Date time;
    
        PostDataOut(Post post)
        {
            this.ownerid = post.getPoster().getId();
            this.groupid = post.getUserGroup().getId();
            this.id = post.getId();
            this.nick = post.getPoster().getNick();
            this.title = post.getTitle();
            this.text = post.getText();
            this.time = post.getTime(); 
        }
    }
    
    // For creating posts
    @POST
    @Path("post")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Response getRequest(PostData inData)
    {
        if(inData.userid == null)
        {
            return Response.status(BAD_REQUEST).build();
        }
        
        User user = userReg.find(inData.userid);
        
        if(user == null)
        {
            return Response.status(NOT_FOUND).build();
        }
        
        UserGroup userGroup = uGroupReg.find(inData.groupid);
        
        
        
        if(!user.isMemberOfGroup(userGroup))
        {
             return Response.status(UNAUTHORIZED).build();           
        }

        Post post = new Post(inData.title, inData.text, userGroup, user);

        postReg.create(post);

        return Response.ok(gson.toJson(new PostDataOut(post))).build();
    }


    static class PutData
    {
        public Integer userid;
        public Integer id;
        public String title;
        public String text;
        public String status;
    }
    
    static class PutDataOut
    {
        public Integer ownerid;
        public Integer groupid;
        public Integer id;
        public String nick;
        public String title;
        public String text;
        public Date time;
    
        public PutDataOut(Post post)
        {
            this.ownerid = post.getPoster().getId();
            this.groupid = post.getUserGroup().getId();
            this.id = post.getId();
            this.nick = post.getPoster().getNick();
            this.title = post.getTitle();
            this.text = post.getText();
            this.time = post.getTime();            
        }
    }
    
    // Only for hiding posts currently, could be expanded to updating posts
    @PUT
    @Path("put")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Response putRequest(PutData inData)
    {
        // Most PutData fields are ignored currently
        
        // Respond with status 'bad request' if userid or (post) id haven't
        // been supplied
        if(inData.userid == null || inData.id == null)
        {
            return Response.status(BAD_REQUEST).build();
        }
        
        User user = userReg.find(inData.userid);
        Post post = postReg.find(inData.id);
        
        // Respond with status 'not found' if user or post corresponding to
        // supplied id:s do not exist
        if(user == null || post == null)
        {
            return Response.status(NOT_FOUND).build();
        }
        
        // A given status is interpreted as a request for changing the user's
        // hiddenPost relationship to the given post
        if(inData.status != null)
        {
            // Not allowed to change relationship between user and a post
            // if the user is not member of the group that the post
            // is associated with - WS responds with status 'bad request' if
            // such a request is made. Might be a more fitting error response,
            // but is it all that important? 
            if(!user.isMemberOfGroup(post.getUserGroup()))
            {
                return Response.status(BAD_REQUEST).build();
            }
            
            HiddenPostId hiddenPostId = new HiddenPostId(inData.userid, inData.id);
            
            switch(inData.status.toLowerCase())
            {
                case "hidden":
                // Do nothing if the hidden relationship between the user 
                // and the post exist already
                if(hidePostReg.find(hiddenPostId) == null)
                {
                    hidePostReg.create(new HiddenPost(user, post));   
                }
                break;
                case "visible":
                // Do nothing if it is already the case that the hidden
                // relationship between the user and the post does not exist
                if(hidePostReg.find(hiddenPostId) != null)
                {
                    hidePostReg.delete(new HiddenPostId(inData.userid, inData.id));
                }
                break;
                default:
                return Response.status(BAD_REQUEST).build();
            }
        }
        
        return Response.ok(gson.toJson(new PutDataOut(post))).build();
    }
    
    
    
    
    
    
    @POST
    @Path("create")
    @Consumes({MediaType.APPLICATION_FORM_URLENCODED})
    public Response create(
            @FormParam("title") String title,
            @FormParam("text") String text,
            @FormParam("usergroupId") int userGroupId,
            @FormParam("posterId") int posterId
        ) 
    {
        //User poster = userReg.find(posterId);
        //UserGroup userGroup = uGroupReg.find(userGroupId);
        
                    
        Membership membership = 
                memshipReg.find(new Membership.MembershipId(posterId, userGroupId));
        
        if(membership != null 
                && (membership.getStatus() == 0 || membership.getStatus() == 1))
        {
           // UserGroup userGroup = uGroupsWithName.get(0);

            User poster = userReg.find(posterId);
            UserGroup userGroup = uGroupReg.find(userGroupId);
            
            Post post = new Post(title, text, userGroup, poster);
            
            postReg.create(post);
            
            //userGroup.addPost(post);
            //poster.addPost(post);
            
            //poster.addUserGroup(userGroup);
        
            URI postUri = uriInfo
                    .getAbsolutePathBuilder()
                    .path(String.valueOf(post.getId()))
                    .build(post);
            
            return Response.created(postUri).build();

        }
        
        return Response.status(403).build();
        
    }
    
    /*
    @POST
    @Consumes({MediaType.APPLICATION_FORM_URLENCODED})
    @Produces({MediaType.APPLICATION_JSON})
    public Response getPostsForUser(@FormParam("userId") int userId) 
    {
        User user = userReg.find(userId);
        
        // Return bad request 400 if user does not exist
        if(user == null)
        {
            return Response.status(400).build();
        }
        
        List<Post> posts = new ArrayList<>();
        
        for(Membership memship : user.getMemberships())
        {
            for(Post post : memship.getUserGroup().getPosts())
            {
                posts.add(post);
            }
        }
        
       
        sort(posts, new postComparator());
        
        return Response.ok(gsonEWE.toJson(posts)).build();
    }
    */

    

    
    @POST
    @Consumes({MediaType.APPLICATION_FORM_URLENCODED})
    @Produces({MediaType.APPLICATION_JSON})
    public Response getPostsForUserFromCount(
            @FormParam("userId") int userId,
            @FormParam("from") Date from,
            @FormParam("count") int count
    ) 
    {   
        User user = userReg.find(userId);
        
        // Return bad request 400 if user does not exist
        if(user == null)
        {
            return Response.status(400).build();
        }
        
        List<Post> posts = new ArrayList<>();
        
        for(Membership memship : user.getMemberships())
        {
            for(Post post : memship.getUserGroup().getPosts())
            {
                posts.add(post);
            }
        }


        
        sort(posts, new postComparator());

        return Response.ok(gsonEWE.toJson(posts)).build();
    }
    
    private class GDOComparator implements Comparator<GetDataOut>
    {
        @Override
        public int compare(GetDataOut lGDO, GetDataOut rGDO)
        {
            // Order inverted by switch of lPost and rPost
            return  rGDO.time.compareTo(lGDO.time);
        }
    }
    
    private class postComparator implements Comparator<Post>
    {
        @Override
        public int compare(Post lPost, Post rPost)
        {
            // Order inverted by switch of lPost and rPost
            return rPost.getTime().compareTo(lPost.getTime());
        }
    }
   
    
    @GET
    @Produces({MediaType.APPLICATION_JSON})
    public Response findAll()
    {        
        List<Post> posts = postReg.findAll();
        
        return Response.ok(gsonEWE.toJson(posts)).build();
    }
}
