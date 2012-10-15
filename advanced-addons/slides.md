!SLIDE center

# Advanced add-ons

!SLIDE build

# A little secret...

* Roo add-on types are just templates
* You don't have a `simple` or `advanced` add-on
* Simple add-ons focus on showing how to add commands and some type logic
* Advanced add-ons expose maven building

_Actually mis-named, due to the complexity of the type and metadata APIs_

!SLIDE

# Advanced add-ons

* Configure the Maven POM
* Can create, remove ITDs
* Can respond to file create, update, removal events
* Can modify existing Java class files

!SLIDE 

# Configuring the Maven POM

* Use the `ProjectManager` Roo Service bean
* Can add, remove POM features
* POM wrapper objects for common Maven objects
  * `Dependency` - Maven dependencies
  * `Plugin` - Maven build plug-ins

!SLIDE

# Adding a dependency via the `ProjectManager`

    @@@java
    // Direct API call
    projectOperations.addDependency(
        projectOperations.getFocusedModuleName(),
        "cglib", "cglib-nodep", "2.2.2");    

!SLIDE

# Adding multiple dependencies
   
    @@@java
    Set<Dependency> dependencies = new HashSet<Dependency>();
  
    // fill in from XML file, etc...
    
    projectOperations.addDependencies(
        projectOperations.getFocusedModuleName(),
        dependencies);

!SLIDE
.notes You can also pass a file/path into getConfiguration

# Fetching dependencies from XML files

    @@@java
    String focusedModuleName = 
       projectOperations.getFocusedModuleName();

    // this will fetch from configuration.xml in default package 
    Element documentElement = 
       XmlUtils.getConfiguration(getClass());

    for (Element dependencyElement : 
         XmlUtils.findElements(
           "/configuration/project/dependencies/dependency", 
           documentElement)) {
          
      Dependency dependency = new Dependency(dependencyElement);
      projectOperations.addDependency(focusedModuleName, dependency); 
      
    }

!SLIDE

# Sample Configuration File

    @@@xml
    <?xml version="1.0" encoding="UTF-8" standalone="no"?>
    <configuration>
      <project>
        <dependencies>
          <dependency>
            <groupId>org.springframework.batch</groupId>
            <artifactId>spring-batch-admin-manager</artifactId>
             <version>1.0.0.RELEASE</version>
          </dependency>
        </dependencies>
      </project>
    </configuration>

!SLIDE 

# Other Maven POM sections

* You can add plug-ins, properties, dependency management

* Issues
  * The fetched POM wrapper objects are immutable
  * The constructors are long and a bit difficult
  * You may destroy existing user dependency/plugin settings
  * Consider a warning and a `--force` option for your users
  * Consider a `configuration.xml` file to simplify loading your new POM settings

!SLIDE

# Roo Ninja Skills
* Roo's typing and metadata system
* Adding annotations to Java classes
* Adding an ITD via detection of an annotation

!SLIDE center

# Roo's Typing and Metadata System

!SLIDE

# Roo allows for Type Creation #

* Add-ons can modify types and ITDs
* You need to provide:
  * A metadata object
  * A metadata provider object

!SLIDE

# Refining a Java Type #

* Assumes a properly set-up add-on project
* Metadata class could extend `AbstractItdTypeDetailsProvidingMetadataItem`
* Allows for both ITD and class manipulation

!SLIDE

# In your meta-data class #

    @@@java
    protected AddonsMetadata(
      String identifier, JavaType aspectName, 
      PhysicalTypeMetadata governorPhysicalTypeMetadata) {
    super(identifier, aspectName, governorPhysicalTypeMetadata);

    itdTypeDetails = builder.build();
    if (isValid()) {
        ensureGovernorExtends(new JavaType("java.lang.Thread"));
        ensureGovernorImplements(new JavaType("java.io.Serializable"));
        buildItd();
    }
    

!SLIDE

# Adding ITD methods #

* Use the `MethodMetadataBuilder` to build  methods
* Add the builder you've created with `builder.addMethod`
* These methods get built into the Java class, not the ITD

!SLIDE

# Example ITD Method Builder #

		@@@java
		private MethodMetadataBuilder createThreadSpawner() {
		  final InvocableMemberBodyBuilder bodyBuilder = 
		  	new InvocableMemberBodyBuilder();

		  bodyBuilder.appendFormalLine(
		    "System.out.println(\\"invoking thread!\\");");
		  bodyBuilder.appendFormalLine(
		    "new Thread().start(this);");
		  bodyBuilder.appendFormalLine(
		    "System.out.println(\\"thread spawned!\\");");


		  return new MethodMetadataBuilder(
		      getId(),
		      Modifier.PUBLIC,
		      new JavaSymbolName("sayHello"),
		      JavaType.VOID_PRIMITIVE,
		      bodyBuilder);
		}

!SLIDE

# Calling the metadata builder #

		@@@java
		protected AsyncActionMetadata(...) {
		  super(identifier, aspectName, governorPhysicalTypeMetadata);

		  itdTypeDetails = builder.build();
		  if (isValid()) {

		    ensureGovernorImplements(
		      new JavaType("java.lang.Runnable"));
		      
		    JavaType physicalType = 
		      governorPhysicalTypeMetadata.getType();
		      
		    MethodMetadataBuilder threadRunMethodBuilder = 
		    	createThreadRunnerMethod(physicalType);

		    builder.addMethod(threadSpawnerBuilder);
		    buildItd();
		  }
		}

* Just add it as a builder 

!SLIDE

# Type management in Roo is a huge topic #

* Roo has a rich set of classes for manipulating types, ITDs
* Way beyond the scope of this talk
* Not documented except via JavaDocs
* Best to read the source code, experiment
* Any suggestions submit as JIRAs

