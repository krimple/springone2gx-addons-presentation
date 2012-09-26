!SLIDE bullets

# What is Spring Roo?

* Command-Line Shell

* Configures Projects

* Provides maven-based builds

* Generates code smartly

* Geared toward Spring projects

!SLIDE

# Set up a Spring Project

    @@@java
    roo> project --topLevelPackage org.foo 
       --projectName conference-planner
       
    roo> jpa setup --database HYPERSONIC_PERSISTENT
        --provider HIBERNATE

!SLIDE 

# Set up JPA Entities 

    @@@java
    roo> entity jpa --class ~.model.Conference 
        --testAutomatically
        
    roo> entity jpa --class ~.model.Registration 
        --testAutomatically
    
!SLIDE 

# Set up Conference Fields

    @@@java
    roo> focus --class ~.model.Conference
    
    roo> field string --fieldName conferenceName
    
    roo> field date --fieldName startDate
         --type java.util.Date
         
    roo> field set --fieldName registrations 
         --type ~.model.Registration
         --cardinality ONE_TO_MANY --mappedBy conference
        
!SLIDE 

# Set up Registration Fields

    @@@java
    roo> focus --class ~.model.Registration
    
    roo> field string --fieldName firstName
    
    roo> field string --fieldName lastName
    
    roo> field reference --fieldName conference
       --type ~.model.Conference
       --cardinality MANY_TO_ONE

!SLIDE

# Set up Web MVC

    @@@java
    roo> web mvc setup
    
    roo> web mvc all --package ~.web

!SLIDE 

<img src="sample-application.png"/>

!SLIDE 

# Roo can configure...
<div class="tagcloud">
      Functional Maven build * Spring Framework * 
      JPA 2.0 * Bean Validators * 
      Hibernate, OpenJPA, EclipseLink or Data Nucleus * 
      JPA Providers * Spring Services * 
      Spring Repositories and Spring Data JPA * 
      NoSQL with MongoDB and Spring Data JPA MongoDB * 
      Spring JMS w/ActiveMQ * Email Support * 
      Spring MVC * Solr searching * 
      JSF w/Mojarra * GWT w/MVP or MyFaces * 
      Tiles layouts and theming * Localization * 
      Your pick of RDBMS * Reverse Engineering * 
      Functional Maven build * Logging w/SLF4J * 
      Selenium Web Testing * Persistence JUnit Tests...
</div>      
!SLIDE

# These are installed via Roo Add-Ons

* Java-based recipes

* Some installed with Roo, others are downloadable

* You can go further... and write your own add-ons!
